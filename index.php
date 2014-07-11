<html>
<head><title>Ass Uploader Demo</title>
	<link rel="stylesheet" href="./assuploader.css">
	<style>
	body{
		font-family:sans-serif, tahoma;
		font-size:14px;
	}
	</style>
</head>
<body>
	
	
<div id="assuploader" style="margin:10px;"></div>	


<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
<script src="./assuploader.js"></script>
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
