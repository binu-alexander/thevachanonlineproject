sofia.globals.mediaLargeImage = null;

sofia.globals.mediaImageClick = function(e) {
	e.preventDefault();


	if (sofia.globals.mediaLargeImage != null) {
		sofia.globals.mediaLargeImage.fadeOut(function() {
			$(this).remove();
		});
	}

	var link = $(this),
		url = link.attr('href'),
		img = link.find('img'),
		imgWidth = img.width(),
		imgHeight = img.height(),
		imgOffset = img.offset(),
		win = $(window),
		winHeight = win.height(),
		winWidth = win.width(),

		clonedImage = $('<img src="' + img.parent('a').attr('href') + '" />')

		//clonedImage = img
		//				.clone()
						.appendTo($('body'))
						.addClass('big-image')
						.css({top: imgOffset.top, left: imgOffset.left, width: imgWidth, height: imgHeight }),

		newHeight = winHeight,
		newWidth = winHeight * imgWidth / imgHeight,
		newTop = 0,
		newLeft = winWidth/2 - newWidth/2;

	// if the image is wider in ratio than the window
	if (newLeft < 0) {
		newWidth = winWidth;
		newHeight = winWidth * imgHeight / imgWidth;
		newLeft = 0;
		newTop = winHeight/2 - newHeight/2;
	}

	clonedImage.on('load', function() {
		clonedImage.animate({
			top: newTop,
			left: newLeft,
			width: newWidth,
			height: newHeight
		});
	});

	sofia.globals.mediaLargeImage = clonedImage;

	if (sofia.analytics) {
		sofia.analytics.record('imageclick', url);
	}

	clonedImage.on('click', shrinkImage);

	function shrinkImage() {
		clonedImage.animate(
			{top: imgOffset.top, left: imgOffset.left, width: imgWidth, height: imgHeight },
			{complete: function() { clonedImage.remove();}
		});

		// remove this listener
		$('body').off('click', shrinkImage);
	}

	// click anywhere to remove
	$('body').on('click', shrinkImage);

	return false;
};


// GLOBAL Video window
sofia.globals.videoWindow = null;

$(function() {

	// create window
	var videowidth, videoheight;
	if (screen.width > screen.height) {
		videowidth = 0.55 * screen.width;
		videoheight = 0.5 * screen.height;
	}
	else {
		videowidth = 0.95 * screen.width;
		videoheight = 0.4 * screen.height;
	}

	sofia.globals.videoWindow = new MovableWindow(videowidth,videoheight,'Video','video-player','Description');
	sofia.globals.videoWindow.center();
	sofia.globals.videoWindow.hide();

	sofia.globals.videoWindow.container.find('.close-button').on('click', function() {

		// attempt to hide video
		var video = sofia.globals.videoWindow.container.find('video');
		if (video.length > 0) {
			video[0].pause();
		}

		sofia.globals.videoWindow.body.html('');
	});

});

sofia.globals.mediaVideoClick = function(e) {
	e.preventDefault();

	var link = $(this),
		url = link.attr('href'),
		title = link.attr('title');

	sofia.globals.showVideo(url, title);

	return false;
};

sofia.globals.mediaVideoJfmClick = function(e) {
	e.preventDefault();

	var link = $(this),
		//segmentNumber = link.attr('href'),
		segmentData = link.attr('data-filename'),
		title = link.attr('title'),

		firstSection = $('.section:first'),

		lang = firstSection.length > 0 ? firstSection.attr('data-lang3') : 'eng';


	JesusFilmMediaApi.getPlayer(lang, segmentData, function(iframeUrl) {
		sofia.globals.showIframe(iframeUrl, title);
	});

	return false;
};

sofia.globals.showVideo = function(videoUrl, title, footer) {

	sofia.globals.videoWindow.body.html('');
	var metadata = 'This video is produced by The Bible Project and is embeded here from The Bible Project YouTube channels for non-profit purposes. Visit www.thebibleproject.com for more content.'
	// add video
	// var video = $('<video autoplay controls src="' + videoUrl + '" style="width:100%; height: auto;"></video>')
	// 				.appendTo(sofia.globals.videoWindow.body);
	var video = $('<iframe width="100%" height="99.999999%" src="' + videoUrl + '?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
					.appendTo(sofia.globals.videoWindow.body);
	$( "div.popup-content" ).replaceWith('<span style="font-weight:normal">' + metadata + '</span>');
	sofia.globals.videoWindow.footer.html(footer);

	// title?
	if (title) {
		sofia.globals.videoWindow.title.html(title);
	}

	// show me!
	sofia.globals.videoWindow.show();
}


sofia.globals.showIframe = function(iframeUrl, title) {

	sofia.globals.videoWindow.body.html('');

	// add video
	var iframe = $('<iframe src="' + iframeUrl + '" allowfullscreen frameborder="0" width="' + sofia.globals.videoWindow.body.width() + '" height="' + sofia.globals.videoWindow.body.height() + '"></iframe>')
					.appendTo(sofia.globals.videoWindow.body);

	// title?
	if (title) {
		sofia.globals.videoWindow.title.html(title);
	}

	// show me!
	sofia.globals.videoWindow.show();
}





var MediaLibrary = (function(){


	var
		currentMediaIndex = 0,
		mediaLibraries = null,
		dataIsLoaded = false;

	function init() {

		// load main info
		sofia.ajax({
			dataType: 'json',
			url: 'content/media/media.json',
			success: function(data) {

				mediaLibraries = data.media;


			}, complete: function() {
				loadNextMediaLibrary();
			}
		});

	}

	function loadNextMediaLibrary() {

		//console.log('loadNextMediaLibrary', currentMediaIndex, mediaLibraries.length);

		if (currentMediaIndex < mediaLibraries.length) {

			var mediaLibrary = mediaLibraries[currentMediaIndex];
			currentMediaIndex++;

			sofia.ajax({
				dataType: 'json',
				url: 'content/media/' + mediaLibrary.folder + '/info.json',
				success: function(data) {
					mediaLibrary.data = data;
				},
				complete: function() {
					loadNextMediaLibrary();
				}
			});
		} else {

			dataIsLoaded = true;
			sendMediaCallbacks();
		}

	}


	var getMediaListCallbacks = [];
	function getMediaLibraries(callback) {
		getMediaListCallbacks.push(callback);
		sendMediaCallbacks();
	}
	function sendMediaCallbacks() {

		if (!dataIsLoaded) {
			return;
		}

		while (getMediaListCallbacks.length > 0) {
			var callback = getMediaListCallbacks.pop();

			callback(mediaLibraries);
		}
	}

	var module = {
		getMediaLibraries: getMediaLibraries,
		init: init
	};


	return module;

})();

sofia.initMethods.push(MediaLibrary.init);
