'use strict'
var fs = require('fs');
const Influx = require('influx');

const os = require('os');



const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'dbtest',
 schema: [
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
  		return influx.createDatabase('dbtest');
  	}
  	console.log(names);
	loop();
  })
  .catch(err => {
  	console.log(err)
    console.error(`Error creating Influx database!`);
  })

function readSensors(file) {

	fs.readFile(file, 'utf8', function(err, data) {  
    if (err) throw err;
  	let json = JSON.parse(data);
  	 write(json);
  });
}

function extractSensors() {
	
}

function write(json) {

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
		},
	  }
  ])
}


function loop() {
	setTimeout(loop,100);
}
