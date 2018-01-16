'use strict'
const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/test', function (req, res) {

	console.log("request in coming from " + req.connection.remoteAddress);
	let json = `{
		"location" : 
			[
				{
					"date"      : "103231.19",
					"longitude" : 47.613761,
					"latitude"  : 1.368991
				}
			],
		"rainfall" : 
			[
				{
					"date"  : "2018-01-16T10:33:20.598Z",
					"value" : 30
				}
			],
		"measurements" : 
			[
				{
					"date"          : "2018-01-16T10:30:52.580Z",
				    "temperature"   : 10.00,
				    "pressure"      : 995.03,
				    "humidity"      : 49.9,
			        "luminosity"    : 52852,
			        "wind_heading"  : 173.396482453163,
			        "wind_speed_avg": 38.1,
				    "wind_speed_max": 68.5,
				    "wind_speed_min": 24.1
				}
			]	
	}`
  	res.send(json);

});

console.log("server listening on port 3000");
app.listen(3000);