/*
 * tstod.js
 * Root namespace module
 */

 /* jslint parameters would go here  

 */
 /*global $, tstod */

 var tstod = (function () {
 	var initModule = function ( $container ) {
 		$container.html(
 			'<h1 style="display:inline-block; margin:25px;">' 
 			   + 'hello world!'
 			  + '</h1>'
 			);
 	};

 	return { initModule : initModule };
 } ());
