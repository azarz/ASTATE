'use strict'
var fs           = require('fs');
const Influx     = require('influx');
const os         = require('os');
const sensorsDir = '/var/log/sensors';
const gpsDir     = '/var/log/gpsNmea';
const rainDir    = '/var/log/rainCounter.log';


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

influx.getDatabaseNames()
  .then(names => {
  	let dbexist = false;
  	for (var i = 0; i < names.length; i++) {
  		if (names[i].includes('dbtest')) {
      		dbexist = true;
    	}
  	}
  	if(!dbexist){
  		console.log("database does not exist, creation ...");
  		influx.createDatabase('dbtest');
  		initSensors();
  		initLocation();
  		initRain();
  	}
  	console.log(names);
	loop();
  })
  .catch(err => {
  	console.log(err)
    console.error(`Error creating Influx database!`);
  })


function initSensors() {
	const p =	new Promise((resolve, reject) => {
		let json;
		fs.readFile(sensorsDir, 'utf8', function(err, data) {  
		    if (err){
		    	console.log(err);
		    	reject(err);
		    } 
		  	json = JSON.parse(data);
		  	//console.log('sensors');
		  	//console.log(json);
		  	resolve(json);
		});
	})
	p.then(json =>writeSensors(json));
}


function initLocation(argument) {
	const p =	new Promise((resolve, reject) => {
		let json;
		fs.readFile(gpsDir, 'utf8', function(err, data) {  
		    if (err){
		    	console.log(err);
		    	reject(err);
		    } 
		  	json = transformToJSON(data);
		  	resolve(json);
		});
	})
	p.then(json =>writeLocation(json));
}


function initRain(argument) {
	const p =	new Promise((resolve, reject) => {
		let json;
		fs.readFile(rainDir, 'utf8', function(err, data) {  
		    if (err){

		    	reject(err);
		    } 
		  	json = transformLogToJSON(data);
		  	resolve(json);
		});
	})
	p.then(json =>writeRain(json));
}

function compareSensors() {
	const promises = [];
	promises.push(
		new Promise((resolve, reject) => {
			  	influx.query(`
				    select * from measures
				    where host = ${Influx.escape.stringLit(os.hostname())}
				    order by time desc
				    limit 1
				  `).then(result => {
				    //console.log('last db date ' + result[0].date);
				    resolve(result[0]);
				  }).catch(err => {
				  	reject(err.stack);
				})
		})
	)
	promises.push(
		new Promise((resolve, reject) => {
				let json;
				fs.readFile(sensorsDir, 'utf8', function(err, data) {  
				    if (err){
				    	console.log(err);
				    	reject(err);
				    } 
				  	json = JSON.parse(data);
				  	//console.log('last file date ' + json.date);
				  	resolve(json);
				});
		})
	)

	Promise.all(promises)
	.then(promises => {
	  if(promises[0].date != promises[1].date){
	  		console.log('new sensors value detected');
	  		writeSensors(promises[1]);
	  }
	})
}

function compareLocation() {

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
			let json;
			fs.readFile(gpsDir, 'utf8', function(err, data) {  
			    if (err){
			    	console.log(err);
			    	reject(err);
			    } 
			  	resolve(data);
			});
		})
	)


	Promise.all(promises)
	.then(promises => {
		let result = promises[1];
		let json = transformToJSON(result);

		if(promises[0].date != json.date){
			console.log('new location value detected');		
			writeLocation(json);
		}

	})		

}

function compareRain() {

	const promises = [];

	promises.push(
		new Promise((resolve, reject) => {
			  	influx.query(`
				    select * from rainfall
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

	promises.push(
		new Promise((resolve, reject) => {
			let json;
			fs.readFile(rainDir, 'utf8', function(err, data) {  
			    if (err){
			    	reject(err);
			    }
			    console.log(data);
			  	resolve(data);
			});
		})
	)


	Promise.all(promises)
	.then(promises => {

		let result = promises[1];
		let json   = transformLogToJSON(result);
		//console.log('rain');
		//console.log(json);
		//console.log(promises[0]);
		if(promises[0].date != json.date){
			console.log('new rain value detected');		
			writeRain(json);
		}

	})		

}

function transformToJSON(string){
		
	let splitted  = string.split(',');
	let date      = splitted[1];
	let latitude  = splitted[2]/100;
	let longitude = splitted[4]/100;


	let json = 
			{
				"date"      : date,
				"longitude" : longitude,
				"latitude"  : latitude
			}


	return json;		
}

function transformLogToJSON(string) {

	let json = {"date" : string};

	return json;

}

function writeSensors(json) {
	console.log("writing sensors...");
	influx.writePoints([
	  {
	    measurement: 'measures',
	    tags: { host: os.hostname() },
	    fields: {        
		    date          : json.date,
		    temperature   : json.measure[0].value,
		    pressure      : json.measure[1].value,
		    humidity      : json.measure[2].value,
	        luminosity    : json.measure[3].value,
	        wind_heading  : json.measure[4].value,
	        wind_speed_avg: json.measure[5].value,
		    wind_speed_max: json.measure[6].value,
		    wind_speed_min: json.measure[7].value
		}
	  }
  ])
}

function writeLocation(json){
	console.log("writing location...");
	influx.writePoints([
	  {
	    measurement: 'location',
	    tags: { host: os.hostname() },
	    fields: {        
		    date      : json.date,
		    longitude : json.longitude,
		    latitude  : json.latitude
		}
	  }
  ])
}

function writeRain(json) {
	console.log("writing rain...");

	influx.writePoints([
	  {
	    measurement: 'rainfall',
	    tags: { host: os.hostname() },
	    fields: {        
		    date: json.date
		}
	  }
  ])
}

function loop() {
	compareSensors();
	compareLocation();
	compareRain();
	//console.log("test");
	setTimeout(loop,1000);
}
