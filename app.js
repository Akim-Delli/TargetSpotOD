/**
 * web server entry point.
 */
//'use strict';

var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs')

// Create an http server
app.server = http.createServer(app);

// server configuration
app.configure( function(){
	app.use( express.bodyParser() );
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

// start server
app.server.listen(3000);

console.log('Listening on port 3000 in dev mode');
