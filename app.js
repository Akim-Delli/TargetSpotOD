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
	Station : require('./models/station')(httpClient, fs)
};

// Create an http server
app.server = http.createServer(app);

// server configuration
app.configure( function(){
	app.use(express.urlencoded());
	app.use( express.methodOverride() );
	app.use( express.static( __dirname + '/public' ) );
	app.use( express.static( __dirname + '/mp3' ) );
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

// home route
app.get('/', function(request, response) {
	response.redirect( '/tsod.html');
});

// redirect to home
app.get('/targetspot', function(request, response) {
	response.redirect( '/tsod.html');
});

app.post('/request/station', function (req, res) {
	var station = req.body.station,
		length  = req.body.audioLength;
	if ( null == station ) {
		res.send(400);
		return;
	}
	// delegate to process the request to the Station object (in models)
	models.Station.fetchByStationAndLength(station, length, function onFetchDone(err, audioInfo) {
		if (err || typeof audioInfo == "undefined" || audioInfo.length == 0) {
			res.send(404);
		} else {
			//Send back to the Client a Json string containing duration and mp3 file names
			res.writeHead( 200, {"Content-Type": "text/x-json"} );
			res.end( JSON.stringify(audioInfo) );
		}
	});
});

app.post('/play/ad', function (req, res) {
	var station = req.body.station,
		length  = req.body.audioLength;
	if ( null == station ) {
		res.send(400);
		return;
	}
	// delegate to process the request to the Station object (in models)
	models.Station.getMp3ByStationAndLength(station, length, function onFetchDone(err, audioFiles) {
		if (err || typeof audioFiles == "undefined" || audioFiles.length == 0) {
			res.send(404);
		} else {
			//Send back to the Client a Json string containing duration and mp3 file names
			res.writeHead( 200, {"Content-Type": "text/x-json"} );
			res.end( JSON.stringify(audioFiles) );
		}
	});
});

// Get request for mp3 playing
app.get('/mp3/:file', function(req, res) {
    var fileName = req.params.file;
    if ( null != fileName) {
    	//Streaming the mp3 file.
		res.writeHead( 200, {"Content-Type": "audio/mpeg"} );
		var readStream = fs.createReadStream( './mp3/' + fileName);
      readStream.pipe(res);
    }
});
// start server
port = process.env.PORT || 3000;
app.server.listen(port);
console.log('Listening on port ' + port + ' in dev mode');
