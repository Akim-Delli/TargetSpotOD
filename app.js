/**
 * web server entry point.
 */
'use strict';

var express = require('express');
var http = require('http');
var app = express();
var httpClient = require('request');
var fs = require('fs');
var port;

// Import the Station models
var models = {
	Station: require('./models/station')( httpClient, fs)
};

// Create an http server
app.server = http.createServer(app);

// server configuration
app.configure( function(){
	app.use(express.urlencoded());
	app.use( express.methodOverride() );
	app.use( express.static( __dirname + '/public' ) );
	app.use( app.router );
});
app.configure( 'development', function() {
	app.use( express.logger() );
	app.use( express.errorHandler({
		dumpExceptions : true,
		showStack      : true
	}) );
});
app.configure( 'production', function() {
	app.use( express.errorHandler() );
});

app.get('/', function(request, response) {
	response.redirect( '/tsod.html');
});

app.get('/targetspot', function(request, response) {
	response.redirect( '/tsod.html');
});

app.post('/request/station', function (req, res) {
	var station = req.body.station,
	    length  = req.body.audioLength;
	if (null == station ) {
		res.send(400);
		return;
	}

	models.Station.fetchByStationAndLength(station, length, function onFetchDone(err, audio) {
		if (err || audio.length === 0) {
			res.send(404);
		} else {
			res.send(audio);
		}
	});
	res.send(200);
});

// start server
port = process.env.PORT || 3000;
app.server.listen(port);
console.log('Listening on port ' + port + ' in dev mode');
