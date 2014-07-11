AssUploader 2.0
===============

jQuery File Upload widget with progress bar, upload speed, elapsed &amp; remaining time for jQuery.



How to Use
==========

1. Add HTML DIV element with id "assuploader"
2. Add jQuery Reference
3. Add assuploader.js reference

4. Now Initialize the AssUploader Plugin
<pre>
$(document).ready(function(){
	if($("#assuploader").size()>0){
		$("#assuploader").assuploader({
			formats: 'all', // Set to all or in an array like ['jpg','png','bmp'] to restrict to specific file formats
			maxsize: 2, // in MBs
			uploadpath: './files/', // Absolute Upload Directory Path
			uploadurl : 'assuploader.php', // Absolute path to assuploader.php file should not be on any other domain
			completeCallback: function(){}, // On Upload Complete Call back function
			errorCallback: function(){}, // on error call back function
			title: 'AssUploader' // Your Ass Upload Box Title
		});
	}
});
</pre>

Here you go...<br />
by: <b>Kamran Wajdani</b>
