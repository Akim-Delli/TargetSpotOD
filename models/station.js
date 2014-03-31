module.exports = function( httpClient, fs) {

    /**
     * Public Method fetchByStationAndLength
     *
     * Make a request to Targetspot OD API
     * and download the mp3 files.
     *
     */
	var fetchByStationAndLength = function( station, length, callback) {

		var targetspoturl = createTargetspotUrl( station, length),
            audioInfo = new Array(),
		    i, adCount, fileName ;

        // Http Client to fetch the json data from TOD
  		httpClient( targetspoturl, function (error, response, content) {
  			if (!error && response.statusCode == 200 ) {
  				contentJson = JSON.parse(content);
                if (typeof contentJson.TOD.AdBreaks != "undefined") {
    				adCount = contentJson.TOD.AdBreaks.AdBreak[0].Ad.length;
                    audioInfo.push(fileName);
    				for ( i = 0 ; i < adCount; i++) {
    					fileName = extractFileNameFromUrl( contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri )
    					console.log("Downloading mp3 : ", contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri);
                        audioInfo.push(fileName);

                        // fetch the mp3 file and write it to local folder mp3
    					httpClient(contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri).pipe(fs.createWriteStream('./mp3/' + fileName));
    				}
                }
 
    			callback(error, audioInfo);
  			}
		});
  		return;
  	};

    /**
     * Private Method createTargetspotUrl
     *
     * format the Targetspot OD API URL
     *
     */
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
  			var re = /\/([a-zA-Z0-9_-]+\.mp3)/;
  			
            if (re.test(url)) {
               fileName = re.exec(url);
  			   return fileName[0];
            }
  		}
  	}

  	return {
  		fetchByStationAndLength : fetchByStationAndLength,
  	}
}