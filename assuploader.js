/*
 * jQuery AssFileUploader : File Upload Plugin 1.0
 * https://github.com/codeass/AssUploader
 *
 * Copyright 2014, Kamran Wajdani
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function( $ ) {

$.fn.assuploader = function(options){
	//Assign this to assify for ease of access
	var assify = this, assified = 0, bitrate = 0, speed = 0, timestamp, asstotal = 0, remainingBytes = 0, timeRemaining = 0;
	//Default Settings
	var ass = $.extend({
		debug: false,
		formats: ['jpg','bmp','gif','png'],
		maxsize: 2,
		uploadurl: '',
		uploadpath: './files/',
		completeCallback: function(){},
		errorCallback: function(){},
		title: 'AssUploader'
	}, options);
	
	//Templates	
	// 1. AssUpload Form
	var _form = '<input type="file" id="AssUploaderFile" multiple>';
	
	// 2. AssUpload Box
	var _uploadbox = '<div class="AssUploadBox scrollbar" id="AssUploadBox">'
	+'<div class="AssUploadBoxHead">'
	+'<div class="AssUploadBoxHeadTitle">'+ass.title+'</div>' // Title
	+'<div class="AssUploadBoxHeadOptions">'
	+'<a href="javascript:;" id="ShowHideAssUploadBox"><div class="closed"></div></a>'
	+'</div>' // options
	+'</div>' // Head
	+'<ol id="AssUploadBoxFilesList" class="AssUploadBoxFilesList">'
	+'<li id="AssUploadBoxFilesListHead">'
	+'<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>'
    + '<th id="AssUploadBoxFilesListFileName">Name</th>'
    +'<th width="160">&nbsp;&nbsp;Size</th>'
    +'<th width="250">&nbsp;&nbsp;Status</th>'
    +'<th width="100">&nbsp;&nbsp;Speed</th>'
    +'<th width="100">&nbsp;&nbsp;Elapsed Time</th>'
    +'<th width="110" style="border-right:0px;">&nbsp;&nbsp;Remaining Time</th>'
    +'</tr></table>'
	+'</li>' // List Head
	+'</ol>' // AssUploadBoxFilesList
	+'<ol id="AssUploadBoxFilesList" class="AssUploadBoxFilesListFiles scrollbar"></ol>' // AssUploadBoxFilesList
	+'</div>'; // Box
	
	//Build the plugin
	// 1. Show Form
	this.html(_form);
	
	// 2. Append uploadbox to document
	$('body').append(_uploadbox).show();
	
	//Stop default drag n drop
	$(document).on('dragenter', function (e){
		e.stopPropagation();     e.preventDefault();
	});
	$(document).on('dragover', function (e){
		e.stopPropagation();     e.preventDefault();
	});
	$(document).on('drop', function (e){
		e.stopPropagation();     e.preventDefault();
	});
		
	//File Change function
	var _input = $("#AssUploaderFile");
	_input.on("change", function(){
		if(_input.attr('value')==""){
			//Nothing selected so far	
		}else{
			for(var i = 0; i < _input[0].files.length; i++){
				var status = new assInfo(_input[0].files[i]);	
				
				var fd = new FormData();
        		fd.append('file', _input[0].files[i]);
        		fd.append('uploadpath', ass.uploadpath);
        		
        		timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
        		assified = 0;
        		bitrate = 0;
        		
        		var ext = _input[0].files[i].name.split('.').pop().toLowerCase();
        		var msize = _input[0].files[i].size/1024;
        		if(ass.formats== "all"){
        			if((msize / 1024)>ass.maxsize){
        				status.setError('You can upload a file upto '+ass.maxsize+'MB in size...');
        			}else{
        				sendFileToServer(fd, status);
        			}
        		}else{
        			if($.inArray(ext, ass.formats) == -1){
        				var fors = ass.formats.toString().replace("[", "").replace("]", "").replace("'", "");
        				status.setError('Only '+fors+' are allowed...');
        			}else{
        				if((msize / 1024)>ass.maxsize){
        					status.setError('You can upload a file upto '+ass.maxsize+'MB in size...');
        				}else{
        					sendFileToServer(fd, status);
        				}
        			}
        		}
			}
			_input.attr('value','');
		}
	});
	
	$("a#ShowHideAssUploadBox").on("click", function(){
		if($(this).find("div").hasClass("open")){
			showAssUploadBox("hide");
		}else{
			showAssUploadBox("show");
		}	
	});
	
	function UploadSpeed(ospeed){
		var now = ((Date.now) ? Date.now() : (new Date()).getTime());
        var nspeed = event.loaded / (now - timestamp);
        var speedStr;
		if(parseInt(nspeed) > 1024){  
			nspeed = nspeed / 1024;
			speedStr = nspeed.toFixed(2)+" mb/s";	
		}else{
			speedStr = nspeed.toFixed(2)+" kb/s";
		}
		return speedStr;
	}
	
	function formatTime(millisSinceEpoch) {
  		var secondsSinceEpoch = (millisSinceEpoch / 1000) | 0;
  		var secondsInDay = ((secondsSinceEpoch % 86400) + 86400) % 86400;
  		var seconds = secondsInDay % 60;
  		var minutes = ((secondsInDay / 60) | 0) % 60;
  		var hours = (secondsInDay / 3600) | 0;
  		if(hours<10){ hours = '0'+hours; }
  		return hours + (minutes < 10 ? ":0" : ":")
      		+ minutes + (seconds < 10 ? ":0" : ":")
      		+ seconds;
	}

	function formatSize(filesize){
		var sizeStr;
		if(parseInt(filesize) > 1024){  
			var sizeMB = filesize/1024;
			if(sizeMB>1024){
				sizeMB = sizeMB / 1024;
				sizeStr = sizeMB.toFixed(2)+" GB";  	
			}else{
				sizeStr = sizeMB.toFixed(2)+" MB";  	
			}
		}else{  
			sizeStr = filesize.toFixed(2)+" KB"; 
		}
		return sizeStr;
	}
	
	function showAssUploadBox(mode){
		var ibtm = "0px";
		if(mode=="show"){
			$("a#ShowHideAssUploadBox").css("padding", "3px 8px 9px 8px");
			$("a#ShowHideAssUploadBox div").removeClass("closed").addClass("open");
			ibtm = "0px";
		}else{
			$("a#ShowHideAssUploadBox").css("padding", "10px 8px 3px 8px");
			$("a#ShowHideAssUploadBox div").removeClass("open").addClass("closed");
			ibtm = "-318px";
		}
		$(".AssUploadBox").animate({ bottom: ibtm }, 500);		  
	}
	
	//Ass Information
	function assInfo(file){
		var ext = file.name.split('.').pop().toLowerCase(),
		filesize = file.size/1024;
			
		this.speedass = '';
		//LIST Template
		//Progressbar
		this.li = $('<li id=""></li>');
		this.table = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(this.li);
		this.tr = $('<tr></tr>').appendTo(this.table);
    	this.fname = $('<th id="AssUploadBoxFilesListFileName">'+file.name+'</th>').appendTo(this.tr);
    	this.sic = $('<th width="160">&nbsp;&nbsp;&nbsp;'+formatSize(filesize)+'</th>').appendTo(this.tr);
    	this.pbc = $('<th width="250" id="asspb"></th>').appendTo(this.tr);
    	this.pb = $('<div id="" class="AssProgressBar"><div class="AssBar"></div></div>').appendTo(this.pbc);	
    	this.spc = $('<th width="100"></th>').appendTo(this.tr);
    	this.etmc = $('<th width="100">&nbsp;&nbsp;00:00:00</th>').appendTo(this.tr);
    	this.tmc = $('<th width="110" style="border-right:0px;">&nbsp;&nbsp;00:00:00</th>').appendTo(this.tr);
    	$("ol.AssUploadBoxFilesListFiles").append(this.li).show();
    	if($("ol.AssUploadBoxFilesListFiles li").size()>9){
    		$(".AssUploadBox ol.AssUploadBoxFilesListFiles li").css("padding", "0px 2px 0px 10px");
		}
		
		$("ol.AssUploadBoxFilesListFiles").animate({ scrollTop: $("ol.AssUploadBoxFilesListFiles")[0].scrollHeight }, 500);
		showAssUploadBox("show");
				
		this.setError = function(message){
			this.li.css("background", "#FFCFCF");	
			this.fname.append('<div style="margin-top:2px;font-size:11px;color:red;">'+message+'</div>');
		}
						
		this.setProgress = function(progress){
			var progressBarWidth = progress  * this.pb.width() / 100;  
            this.pb.find('div').animate({ width: progressBarWidth }, 100);
		}
		
		this.setElapsedTime = function(timeStr){
			this.etmc.html('&nbsp;&nbsp;'+timeStr);
		}
		
		this.setRemainingTime = function(timeStr){
			this.tmc.html('&nbsp;&nbsp;'+timeStr);
		}
		
		this.setSpeed = function(speed){
			this.spc.html('&nbsp;&nbsp;&nbsp;'+speed);
		}
		
		this.setSize = function(size){
			this.sic.html(size);	
		}
		
		this.setComplete = function(){
			this.pb.find('div').removeClass('AssBGAnimate').css("background-color", "#00FF85");
		}
	}
		
	function sendFileToServer(formData,status){
    var extraData ={};
    var jqXHR=$.ajax({
            xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if (xhrobj.upload) {
                    xhrobj.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                            assified = event.loaded;
                            asstotal = event.total;
                        }
                        var osize = formatSize(event.total / 1024);
                        var lsize = formatSize(event.loaded / 1024);
                        var nsize = '&nbsp;&nbsp;&nbsp;'+lsize+' / '+osize;
                        status.setSize(nsize);
                        
                        if(percent>99){ 
                        	status.setSpeed("0 b/s");
                        	status.setRemainingTime('00:00:00');
                        }else{
                    		status.setSpeed(UploadSpeed(event.loaded));
                    		var rb = event.total - event.loaded;
                    		var now = ((Date.now) ? Date.now() : (new Date()).getTime());
        					var ispeed = event.loaded / (now - timestamp);
                    		status.setRemainingTime(formatTime(rb / ispeed));
                    		
                    		status.setElapsedTime(formatTime(now-timestamp));
                        }
                        status.setProgress(percent);  
                        
                    }, false);
                }
            return xhrobj;
        },
    	url: ass.uploadurl,
    	type: "POST",
    	contentType:false,
    	processData: false,
        cache: false,
        data: formData,
        success: function(data){
        	if(ass.debug){ console.log(data); }
        	var json = $.parseJSON(data);
        	if(data.result=="failed"){
        		// Upload failed do something here
        		status.setError('Your file upload failed...');
        		ass.errorCallback();
        	}else{
        		status.setComplete();
        		status.setSpeed('0 b/s'); 
        		ass.completeCallback();
        	}
        },
        error: function(){
        	status.setError('Your file upload failed...');
        	ass.errorCallback();
        }
    }); 

	}
	
	return this;
}
	
}(jQuery));
