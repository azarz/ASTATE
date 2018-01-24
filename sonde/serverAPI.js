'use strict'
const express     = require('express');
const Influx      = require('influx');
const http        = require('http');
const cors        = require('cors');
const os          = require('os');
const promesse    = require ('./promises/promises.js');     
const app         = express();

//Création du serveur
app.use(cors());
var server = require('http').createServer(app);
//Création des websockets
var io = require('socket.io')(server);

// A la connection, emit un message "welcome", sinon toutes les 60 secondes, emit un message "update"
io.on('connection', socket => {socket.emit('welcome', { message: 'Vous êtes connecté à  ASTATE!' });});
setInterval( () => {io.emit('update')} , 60000);


 /* getion de toutes les routes possibles : ici gestion de la route /last et /last/all
  * Chaque route fonctionne entièrement avec des listes de promesses.
  * Une fois que toutes les promesses sont résolues, le json est renvoyé.
  * Chaque promesse contient un appel à la base de donnée qui sera résolu une fois les informations extraites
  */
app.get(['/last/all','/last'], function (req, res) {

	console.log("request /last in coming from " + req.connection.remoteAddress);

	const promises = [];

	promises.push(promesse.dbAllPromise('location'));
	promises.push(promesse.dbAllPromise('measures'));
	promises.push(promesse.dbAllPromise('rainfall'));


	Promise.all(promises)
	.then(promises => {
		let location = promises[0];
		let result   = promises[1];
		let rainfall = promises[2];

		let json = {
			"location"     : location,
			"rainfall"     : rainfall,
			"measurements" : result	}
		res.send(json);
	})

})

//Gestion de la route /last/location, ici une liste contenant une seule promessse
app.get('/last/location', function (req, res) {

	console.log("request /last/location in coming from " + req.connection.remoteAddress);

	const promises = [];

	promises.push(promesse.dbAllPromise('location'));

	Promise.all(promises)
	.then(promises => {
		let location = promises[0];
		let json = {"location" : location}
		res.send(json);
	})
})


//Même chose pour la route /last/rainfall
app.get('/last/rainfall', function (req, res) {

	console.log("request /last/rainfall in coming from " + req.connection.remoteAddress);

	const promises = [];

	promises.push(promesse.dbAllPromise('rainfall'));

	Promise.all(promises)
	.then(promises => {
		let rainfall = promises[0];
		let json = {"rainfall" : rainfall}
		res.send(json);
	})
})


// Même chose pour la route /last/measuremnts
app.get('/last/measurements', function (req, res) {

	console.log("request /last/measurements in coming from " + req.connection.remoteAddress);

	const promises = [];

	promises.push(promesse.dbAllPromise('measures'));

	Promise.all(promises)
	.then(promises => {
		let result = promises[0];
		let json = {"measurements" : result}
		res.send(json);
	})
})


//Gestion de la route /interval qui va utiliser des promesses légèrement différentes
app.get('/interval', function (req, res) {

	console.log("request /interval in coming from " + req.connection.remoteAddress);

	let start = req.query.start;
	let stop  = req.query.stop;

	const promises = [];

	promises.push(promesse.dbIntervalPromise('location',start,stop));
	promises.push(promesse.dbIntervalPromise('measures',start,stop));
	promises.push(promesse.dbIntervalPromise('rainfall',start,stop));


	Promise.all(promises)
	.then(promises => {
		let location = promises[0];
		let result   = promises[1];
		let rainfall = promises[2];
		let json = {
		"location"     : location,
		"rainfall"     : rainfall,
		"measurements" : result	}

		res.send(json);
	})

})

//Gestion de la route /interval/location
app.get('/interval/location', function (req, res) {

	console.log("request /interval in coming from " + req.connection.remoteAddress);

	let start = req.query.start;
	let stop  = req.query.stop;

	const promises = [];

	promises.push(promesse.dbIntervalPromise('location',start,stop));

	Promise.all(promises)
	.then(promises => {
		let location = promises[0];
		let json = {"location" : location}
		res.send(json);
	})
})

app.get('/interval/rainfall', function (req, res) {

	console.log("request/interval/rainfall in coming from " + req.connection.remoteAddress);

	let start = req.query.start;
	let stop  = req.query.stop;

	const promises = [];

	promises.push(promesse.dbIntervalPromise('rainfall',start,stop));

	Promise.all(promises)
	.then(promises => {
		let rainfall = promises[0];
		let json = {"rainfall" : rainfall}
		res.send(json);
	})
})

app.get('/interval/measurements', function (req, res) {

	console.log("request /interval/measurements in coming from " + req.connection.remoteAddress);

	let start = req.query.start;
	let stop  = req.query.stop;

	const promises = [];

	promises.push(promesse.dbIntervalPromise('measures',start,stop));

	Promise.all(promises)
	.then(promises => {
		let measurements = promises[0];
		let json = {"measurements" : measurements}
		res.send(json);
	})
})
app.listen(3000);