AssUploader 2.0
===============

jQuery File Upload widget with progress bar, upload speed, elapsed &amp; remaining time for jQuery.



How to Use
==========

1. Add HTML DIV element
<div id="assuploader" style="margin:10px;"></div>	

2. Add jQuery Reference
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>

3. Add assuploader.js reference
<script src="assuploader.js"></script>

4. Now Initialize the AssUploader Plugin
<script>
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
</script>
