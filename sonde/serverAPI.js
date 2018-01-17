'use strict'
const express = require('express');
const Influx  = require('influx');
const http    = require('http');
const cors    = require('cors');
const os      = require('os');
const app     = express();

app.use(cors());


const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'dbtest',
 schema: 
 [
   {
   	measurement: 'location',
   	fields:{
   		date      : Influx.FieldType.STRING,
   		longitude : Influx.FieldType.FLOAT, 
   		latitude  : Influx.FieldType.FLOAT
   	},
   	tags:[
   		'host'
   	]
   },
   {
     measurement: 'measures',
     fields: {
       date           : Influx.FieldType.STRING,
       temperature    : Influx.FieldType.FLOAT,
       pressure       : Influx.FieldType.FLOAT,
       humidity       : Influx.FieldType.FLOAT,
       luminosity     : Influx.FieldType.FLOAT,
       wind_heading   : Influx.FieldType.FLOAT,
       wind_speed_avg : Influx.FieldType.FLOAT,
	   wind_speed_max : Influx.FieldType.FLOAT,
	   wind_speed_min : Influx.FieldType.FLOAT
     },
     tags: [
       'host'
     ]
   },
   {
   	measurement: 'rainfall',
   	fields:{
   		date : Influx.FieldType.STRING
   	},
   	tags:[
   		'host'
   	]
   }
 ]
})



app.get(['/last/all','/last'], function (req, res) {

	console.log("request in coming from " + req.connection.remoteAddress);

	const promises = [];

	promises.push(
		new Promise((resolve, reject) => {
			  	influx.query(`
				    select * from location
				    where host = ${Influx.escape.stringLit(os.hostname())}
				    order by time desc
				    limit 1
				  `).then(result => {
				    //console.log('location')
				    //console.log(result[0]);
				    resolve(result[0]);

				  }).catch(err => {
				  	//console.log(err);
				  	reject(err.stack);
				})
		})
	)

	promises.push(
		new Promise((resolve, reject) => {
		  	influx.query(`
			    select * from measures
			    where host = ${Influx.escape.stringLit(os.hostname())}
			    order by time desc
			    limit 1
			  `).then(result => {
			    resolve(result[0]);
			  }).catch(err => {
			  	reject(err.stack);
			})
		})
	)


	Promise.all(promises)
	.then(promises => {
		let location = promises[0];
		let result   = promises[1];
		let json = {
			"location" : 
				[
					{
						"date"      : location.date,
						"longitude" : location.longitude,
						"latitude"  : location.latitude
					}
				],
			"rainfall" :
				[
					{
						"date"  : "2018-01-16T10:33:20.598Z"
					}
				],
			"measurements" : 
				[
					{
						"date"          : result.date,
					    "temperature"   : result.temperature,
					    "pressure"      : result.pressure,
					    "humidity"      : result.humidity,
				        "luminosity"    : result.luminosity,
				        "wind_heading"  : result.wind_heading,
				        "wind_speed_avg": result.wind_speed_avg,
					    "wind_speed_max": result.wind_speed_max,
					    "wind_speed_min": result.wind_speed_min
					}
				]	
		}
		res.send(json);
	})

	//console.log("server listening on port 3000");
})

app.listen(3000);