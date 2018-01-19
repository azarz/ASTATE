'use strict'
const express     = require('express');
const Influx      = require('influx');
const http        = require('http');
const cors        = require('cors');
const os          = require('os');
const promesse    = require ('./promises/promises.js');     
const app         = express();

app.use(cors());


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
		//console.log(rainfall);
		let json = {
			"location"     : location,
			"rainfall"     : rainfall,
			"measurements" : result	}
		//console.log(json);
		res.send(json);
	})

	//console.log("server listening on port 3000");
})

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
		//console.log(rainfall);
		let json = {
		"location"     : location,
		"rainfall"     : rainfall,
		"measurements" : result	}//console.log(json);

		res.send(json);
	})

})

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