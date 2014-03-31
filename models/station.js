module.exports = function (httpClient, fs) {

    /**
     * Public Method fetchByStationAndLength
     *
     * Make a request to Targetspot OD API
     * and download the mp3 files.
     *
     */
	var fetchByStationAndLength = function (station, length, callback) {

		var targetspoturl = createTargetspotUrl( station, length),
            audioInfo = [],
		    i, adCount, fileName ;

        // Http Client to fetch the json data from TOD
  		httpClient(targetspoturl, function (error, response, content) {
  			if (!error && response.statusCode === 200) {
  				contentJson = JSON.parse(content);
                if (typeof contentJson.TOD.AdBreaks != "undefined") {
    				adCount = contentJson.TOD.AdBreaks.AdBreak[0].Ad.length;
                    audioInfo.push(fileName);
    				for ( i = 0 ; i < adCount; i++) {
    					fileName = extractFileNameFromUrl( contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri );
    					console.log("Downloading mp3 : ", contentJson.TOD.AdBreaks.AdBreak[0].Ad[i].MediaFile.uri);
                        audioInfo.push(fileName);

                        // prepend the station name and length for easy retrieval and classification
                        fileName = station + "_" + length + "sec_" + fileName; 

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
     * Public Method getMp3ByStationAndLength
     *
     * find the list of mp3 localy saved
     *
     *
     */
    var getMp3ByStationAndLength = function (station, length, callback) {
        // match the station and the length
        var regex = new RegExp(station + "_" + length + "sec_");
        var fileList = fs.readdirSync("./mp3");
        var error;
        mp3Files = fileList.filter(function(val) {
            return regex.test(val);
        });
        if (mp3Files.length === 0) {
            error = "No files found";
        }
        callback(error, mp3Files);

    };

    /**
     * Private Method createTargetspotUrl
     *
     * format the Targetspot OD API URL
     *
     */
  	var createTargetspotUrl = function (station, length) {
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
  			   return fileName[1];
            }
  		}
  	}

  	return {
  		fetchByStationAndLength : fetchByStationAndLength,
        getMp3ByStationAndLength: getMp3ByStationAndLength
  	}
}