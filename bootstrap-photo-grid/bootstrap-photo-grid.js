var PATH = "../img/releases/";
var MAX_COLS = 4;

function render() {
	console.log("Reading CSV data...");
	$.getJSON('/bootstrap-photo-grid/csvData.php', function(csvData) {
		buildHTML(csvData);
		fadeInGrid(0, csvData);
	});
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

function buildHTML(csvRecords) {
	console.log("Building html...\n");
	console.log("CSV Records = " + JSON.stringify(csvRecords) + "\n");
	var div = $('#releases');

	var rows = csvRecords.length / MAX_COLS;
	for(var i = 0; i < rows; i++) {
		div.append('<div class="row image-row">' +
				   		'<div id="row-' + i + '" class="span9">' +
				   		'</div> <!-- span -->' +
				   '</div> <!-- row -->');

		for(var j = 0; j < MAX_COLS; j++) {
			var index = j + (i * MAX_COLS);

			if(index < csvRecords.length) {
				var rec = JSON.parse(JSON.stringify(csvRecords[index]));
				appendThumbnailHTMLForRecordToDiv(rec, '#row-' + i);
				appendModalHTMLForRecordToDiv(rec, '#row-' + i);
			}
		}
	}
}

function appendThumbnailHTMLForRecordToDiv(rec, div) {
	console.log("Adding " + rec.release + "\n" + rec.artist + ", " + rec.album + "(" + rec.thumb + ")");
	var title = rec.release + ": " + rec.album;

	$(div).append('<div id="' + rec.release + '-span" class="span2 hide">' + 
				  	'<a data-toggle="modal" href="#' + rec.release + '">' +
				  		'<img src="' + PATH + rec.thumb + '" class="img-polaroid thumb" alt="' + title + '" title="' + title + '"/>' + 
				  	'</a>' +
				  '</div>');
}

function appendModalHTMLForRecordToDiv(rec, div) {
	console.log("Adding modal " + rec.release + "\n" + rec.artist + ", " + rec.album + "(" + rec.full + ")");
	var label = rec.release + "-modal";
	var storeLink = "http://store.likeyoungrecords.com";
	var title = rec.release + ": " + rec.album;

	$(div).append('<div id="' + rec.release + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="' + label + '" aria-hidden="true">' +
				  	'<div class="modal-header">' +
				  		'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
				  		'<h3 id="' + label + '" class="text-left">' + 
				  			'<a href="' + rec.url + '" target="_blank">' + rec.artist + '</a> <small>' + rec.album + '</small>' + 
				  		'</h3>' +
				  	'</div> <!-- header -->' +
				  	'<div class="modal-body">' +
				  		'<img src="' + PATH + rec.full + '" class="img-polaroid full" alt="' + title + '" title="' + title + '"/>' +
				  	'</div> <!-- body -->' +
				  	'<div class="modal-footer">' +
				  		'<h3 class="text-center">' + 
				  			'<a href="' + storeLink + '" target="_blank">' + rec.release + '</a> <small>' + rec.details + '</small>' + 
				  		'</h3>' +
				  	'</div> <!-- footer -->' +
				  '</div> <!-- modal -->');
}