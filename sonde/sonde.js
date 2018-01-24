'use strict'
// Tous les modules utilisés
var fs           = require('fs'); // pour la lecture de fichier
const Influx     = require('influx');// pour la lecture de base de données
const os         = require('os');// pour la lecture de chemin d'accès

//Les différents chemins d'accès dans lesquels sont stockés les données
const sensorsDir = '/dev/shm/sensors'; 
const gpsDir     = '/dev/shm/gpsNmea';
const rainDir    = '/dev/shm/rainCounter.log';

// Le schéma correspondant à la base de données
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

//Création eventuel de la base de donnée si cette dernière n'existe pas
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

// Insertion d'une valeur dans la table Sensors
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

// Insertion d'une valeur dans la table de Location
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

//Insertion d'une valeur dans la table rainfall
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


// On compare la dernière valeur du fichier avec celle de la base de donnée. Si elles sont différentes
// on insère la valeur de senseurs du fichier dans la base de données
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
				    try{
						json = JSON.parse(data);
				    } 
				    catch(error){
				    	reject(error);
				    }
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

// Meme chose pour la location
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

// Même chose pour le fichier rainfall
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
			    //console.log(data);
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


//On transforme en JSON le contenu que l'on récupère dans le fichier (string)
function transformToJSON(string){
		
	let splitted  = string.split(',');
	let date      = splitted[1].trim();
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

// On transforme le format des logs en json
function transformLogToJSON(string) {

	let json = {"date" : string.trim()};

	return json;

}


// Fonction d'écriture d'une valeur de senseur dans la base de donnée
function writeSensors(json) {
	console.log("writing sensors...");
	influx.writePoints([
	  {
	    measurement: 'measures',
	    tags: { host: os.hostname() },
	    fields: {        
		    date          : json.date.trim(),
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

// Même chose pour la location
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

// Même chose pour la pluie
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

// la fonction loop s'appelle elle même toutes les 60 secondes pour mettre à jour sa base de donnée
// Elle compare les nouvelles valeurs des fichiers avec celles comprises dans la base de données puis éventuellement 
// les stockent.
function loop() {
	try{
		compareSensors();
		compareLocation();
		compareRain();
	}
	catch(error){
		  console.log(error);
	}

	//console.log("test");
	setTimeout(loop,60000);
}
