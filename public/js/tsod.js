/*
 * tsod.js
 * Root namespace module
 */

/* jslint parameters would go here */

/*global $, tsod */



var tsod = (function () {

	// Maka a post reuest to the server and display a success or error message
	var requestStation = function () {
			// Ajax request to the Node.js server
			$.post('/request/station', {
				station:      $('#requestStationForm input[name=station]').val(),
				audioLength:  $('#requestStationForm input[name=audioLength]').val(),
			}, function ( data) {
				// On Success display a message of the list of audio files downloaded
				console.log( data);
				$("#success").html('<a class="close" data-dismiss="alert">×</a><strong>Successfully Downloaded the audio file(s) :</strong>' + formatlistAudioFiles(data));
				$("#success").fadeIn();
			}).error(function() {
				// On error message
				$("#error").html('<a class="close" data-dismiss="alert">×</a><strong>Sorry!</strong> Unable to fetch the station with the audio length requested.');
				$("#error").fadeIn();
			});
			return false;
		};

		var playAd = function () {
			// Ajax request to the Node.js server
			$.post('/play/ad', {
				station:      $('#playAdForm input[name=stationAd]').val(),
				audioLength:  $('#playAdForm input[name=audioLengthAd]').val(),
			}, function ( data) {
				// On Success display a message of the list of audio files downloaded
				console.log( data);
				$("#success").html('<a class="close" data-dismiss="alert">×</a><strong>MP3 files:</strong>' + formatAudioFilesToPlay(data));
				$("#success").fadeIn();
			}).error(function() {
				// On error message
				$("#error").html('<a class="close" data-dismiss="alert">×</a><strong>Sorry!</strong> Unable to find the station with the audio length requested.');
				$("#error").fadeIn();
			});
			return false;
		};

	// format the list of audio files into a HTML list
	var formatlistAudioFiles = function ( AudioList) {
		
		var htmlList = "<br>";
		if (AudioList !== "undefined") {
			htmlList = htmlList + '<ul class="list-group">';
			// Loop over the list of audio file name and create a new list item containing the file name
			AudioList.forEach( function ( audio) {
				if ( null !== audio) {
					htmlList = htmlList + '<li class="list-group-item">' + audio + '</li>';
				}
				htmlList = htmlList + "</ul>";
			})
		}
		return htmlList;
	};

	// format the list of audio files to play
	var formatAudioFilesToPlay = function ( AudioList) {
		
		var htmlList = "<br>";
		if (AudioList !== "undefined") {
			htmlList = htmlList + '<ul class="list-group">';
			// Loop over the list of audio file name and create a new list item containing the file name
			AudioList.forEach( function ( audio) {
				if ( null !== audio) {
					htmlList = htmlList + '<a href="/mp3/' + audio + '" target="_blank">' +
						'<li class="list-group-item"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-play"> </span></button>  ' 
						+  audio + '</a>';
				}
				htmlList = htmlList + "</ul>";
			})
		}
		return htmlList;
	};

 	return { requestStation: requestStation,
 			 playAd        : playAd };
} ());

// DOM click events Handlers
$(function(){
	
	// Hide the Success and error messages container at loading.
	$("#error").hide();
	$("#success").hide();

	$('button#submitStation').click(function (e) {
		$("#error").hide();
		$("#success").hide();
		e.preventDefault();
		tsod.requestStation();
		return false;
	});

	$('button#adPlay').click(function (e) {
		$("#error").hide();
		$("#success").hide();
		e.preventDefault();
		tsod.playAd();
		return false;
	});

});
 
