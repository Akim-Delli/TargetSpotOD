module.exports = function( httpClient, fs) {


	var fetchByStationAndLength = function( station, length, callback) {

		var targetspoturl = createTargetspotUrl( station, length),
		    i, adCount, fileName;
  		httpClient( targetspoturl, function (error, response, content) {
  			if (!error && response.statusCode == 200 ) {
  				contentJson = JSON.parse(content);
  				adCount = contentJson.TOD.AdBreaks.AdBreak[0].Ad.length;
  				for ( i = 0 ; i < adCount; i++) {
  					fileName = extractFileNameFromUrl( contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri )
  					console.log("Downloading mp3 : ", contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri);
  					httpClient(contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri).pipe(fs.createWriteStream('./mp3/' + fileName));
  				}
 
    			//console.log(contentJson.TOD.AdBreaks.AdBreak[0].Ad.length) 
  			}
		});
  		return;
  	};

  	var createTargetspotUrl = function( station, length) {
  		var targetspoturl;

  		if (null === station) {
  			return;
  		}
  			targetspoturl = 'http://demo.targetspot.com/tod.php?station=' + station;
  			targetspoturl = targetspoturl + "&length=" + length;

  		return targetspoturl; 
  	}
  	/*
	 * Method extractFileNameFromUrl
	 *
	 * Extract the MP3 File name from the URI
	 */
  	var extractFileNameFromUrl = function( url) {

  		var fileName;
  		if (url) {
  			var re = /\/([0-9_-]+\.mp3)/;
  			fileName = re.exec(url);
  			return fileName[0];
  		}
  	}

  	return {
  		fetchByStationAndLength : fetchByStationAndLength,
  	}
}