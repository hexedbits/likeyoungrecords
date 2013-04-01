var PATH = "../img/releases/";
var MAX_COLS = 4;

function render() {
	console.log("Getting image count...");
	$.get('/bootstrap-photo-grid/imageCount.php', function(count) {

		var imageData = getImageList(count);

		console.log("Getting CSV data...");
		$.getJSON('/bootstrap-photo-grid/csvData.php', function(csvData) {
			buildHTML(imageData, csvData);
			fadeInGrid(0, csvData);
		});
	});
}

function getImageList(total) {
	console.log("Building json for " + total + " images...");
	var prefix = "lyr";
	var sep = "-";
	var ext = ".jpg";

	var images = [];

	for(var i = 0; i < total; i++) {
		var zero = (i < 9) ? "0" : "";

		var base = prefix + sep + zero + (i+1) + sep;
		var thumb = base + "thumb" + ext;
		var full = base + "full" + ext;
		images[i] = {"thumb" : thumb , "full" : full};
	}

	return images;
}

function fadeInGrid(n, csvRecords) {
	console.log("Begin fade in...");

	if(n >= csvRecords.length) {
		console.log("Fade Done! Yay for recursion!");
		return;
	}
	else {
		var rec = JSON.parse(JSON.stringify(csvRecords[n]));
		var imgSpan = $('#' + rec.release + '-span');
		
		setTimeout(function() {	
			console.log("FADE " + rec.release);
			imgSpan.fadeIn('slow', function() {
				fadeInGrid(n+1, csvRecords);
			});	
		}, 0);
	}
}

function buildHTML(imageList, csvRecords) {
	console.log("Building html...\n");
	console.log("Image List = " + JSON.stringify(imageList) + "\n");
	console.log("CSV Records = " + JSON.stringify(csvRecords) + "\n");
	var div = $('#releases');

	var rows = imageList.length / MAX_COLS;
	for(var i = 0; i < rows; i++) {
		div.append('<div class="row image-row">' +
				   		'<div id="row-' + i + '" class="span9">' +
				   		'</div> <!-- span -->' +
				   '</div> <!-- row -->');

		for(var j = 0; j < MAX_COLS; j++) {
			var index = j + (i * MAX_COLS);

			if(index < imageList.length) {
				var img = JSON.parse(JSON.stringify(imageList[index]));
				var rec = JSON.parse(JSON.stringify(csvRecords[index]));
				appendImageWithInfoToDiv(img, rec, '#row-' + i);
				appendModalDivWithImageAndInfoToDiv(img, rec, '#row-' + i);
			}
		}
	}
}

function appendImageWithInfoToDiv(image, info, div) {
	console.log("Adding " + info.release + "\n" + info.artist + ", " + info.album + "(" + image.thumb + ")");
	var title = info.release + ": " + info.album;

	$(div).append('<div id="' + info.release + '-span" class="span2 hide">' + 
				  	'<a data-toggle="modal" href="#' + info.release + '">' +
				  		'<img src="' + PATH + image.thumb + '" class="img-polaroid thumb" alt="' + title + '" title="' + title + '"/>' + 
				  	'</a>' +
				  '</div>');
}

function appendModalDivWithImageAndInfoToDiv(image, info, div) {
	console.log("Adding modal " + info.release + "\n" + info.artist + ", " + info.album + "(" + image.full + ")");
	var label = info.release + "-modal";
	var storeLink = "http://store.likeyoungrecords.com";
	var title = info.release + ": " + info.album;

	$(div).append('<div id="' + info.release + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="' + label + '" aria-hidden="true">' +
				  	'<div class="modal-header">' +
				  		'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
				  		'<h3 id="' + label + '" class="text-left">' + 
				  			'<a href="' + info.url + '" target="_blank">' + info.artist + '</a> <small>' + info.album + '</small>' + 
				  		'</h3>' +
				  	'</div> <!-- header -->' +
				  	'<div class="modal-body">' +
				  		'<img src="' + PATH + image.full + '" class="img-polaroid full" alt="' + title + '" title="' + title + '"/>' +
				  	'</div> <!-- body -->' +
				  	'<div class="modal-footer">' +
				  		'<h3 class="text-center">' + 
				  			'<a href="' + storeLink + '" target="_blank">' + info.release + '</a> <small>' + info.details + '</small>' + 
				  		'</h3>' +
				  	'</div> <!-- footer -->' +
				  '</div> <!-- modal -->');
}