'use strict'
const express = require('express');
const Influx  = require('influx');
const http    = require('http');
const cors    = require('cors');
const os      = require('os');

// La structure de la base de donnée
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

// 2 templates de promises utilisés pour faire les appels à la base de donnée
module.exports = {
	dbAllPromise: function(field){
		return new Promise((resolve, reject) => {
			
			let str = "select * from " + field + " where host = " + Influx.escape.stringLit(os.hostname()) + " order by time desc limit 1";
		  	console.log(str);
		  	influx.query(str).then(result => {
			    resolve(result);

			  }).catch(err => {
			  	reject(err.stack);
			})
		})
	},
	dbIntervalPromise: function(field, start, stop) {
			return new Promise((resolve, reject) => {
			let str = "select * from " + field + " where host = " + Influx.escape.stringLit(os.hostname()) 
			+ "AND time >= " + "'" + start + "'" + " AND time <= " + "'" + stop + "'"
			+ " order by time desc ";
		  	console.log(str);
		  	influx.query(str).then(result => {
		  		//console.log(result);
			    resolve(result);

			  }).catch(err => {
			  	reject(err.stack);
			})
		})
	}
}
