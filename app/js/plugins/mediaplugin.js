sofia.config = $.extend(sofia.config, {

	enableMediaLibraryPlugin: true

});

var MediaLibraryPlugin = function(app) {

	if (!sofia.config.enableMediaLibraryPlugin) {
		return;
	}

	var mediaLibraries = null,
		mediaPopup = new InfoWindow('mediapopup'),
		contentToProcess = [];

	//console.log('MediaLibraryPlugin startup', MediaLibrary.getMediaLibraries);

	MediaLibrary.getMediaLibraries(function(data) {
		mediaLibraries = data;

		setupMediaEvents();

		addMedia();
	});

	function setupMediaEvents() {

		// handle clicks
		$('.windows-main').on('click', '.mediathumb', function(e) {

			// determine what kind of media this is
			var
				icon = $(this),
				mediaFolder = icon.attr('data-mediafolder'),
				verse = icon.closest('.verse, .v'),
				verseid = verse.attr('data-id'),
				reference = new bible.Reference(verseid).toString(),
				mediaLibrary = null,
				mediaForVerse = null;

			// find library
			for (var i=0, il=mediaLibraries.length; i<il; i++ ) {
				var ml = mediaLibraries[i]

				if (ml.folder == mediaFolder) {
					mediaLibrary = ml;
					break;
				}

			}

			console.log('media click', mediaLibrary);

			mediaForVerse = mediaLibrary.data[verseid];

			switch (mediaLibrary.type) {

				case 'image':
					// clear it out!
					mediaPopup.body.html('');

					var html = '';
					for (var i=0, il=mediaForVerse.length; i<il; i++ ) {
						var mediaInfo = mediaForVerse[i],
							fullUrl = sofia.config.baseContentUrl + 'content/' + 'media/' + mediaLibrary.folder  + '/' + mediaInfo.filename + '.' + mediaInfo.exts[0],
							thumbUrl = fullUrl.replace('.jpg', '-thumb.jpg');

						html += '<li>' +
									'<a href="' + fullUrl + '" target="_blank">' +
										'<img src="' + thumbUrl + '" />' +
									'</a>' +
								'</li>';
					}

					mediaPopup.body.append('<strong>' + reference.toString() + '</strong>');
					mediaPopup.body.append($('<ul class="inline-image-library-thumbs">' + html + '</ul>'));
					//mediaPopup.center().show();
					mediaPopup.setClickTargets( [icon] );
					mediaPopup.position( icon ).show();
					break;

				case 'video':
					// clear it out!
					mediaPopup.body.html('');

					var html = '';
					var videodetails = {};

					for (var i=0, il=mediaForVerse.length; i<il; i++ ) {
						var mediaInfo = mediaForVerse[i],
							videoUrl = mediaInfo.url;
							thumbUrl = 'https://img.youtube.com/vi/' + mediaInfo.url.split('/')[4] + '/0.jpg';

						html += '<li>' + 
									'<img id="' + mediaInfo.name + '" title="' + mediaInfo.name + '" class="triggerVideo" src="' + thumbUrl + '"/>' +
								'</li>';
						videodetails[mediaInfo.name] = [videoUrl, mediaInfo.description];
					}
					mediaPopup.body.append('<strong>' + reference.toString() + '</strong><br>');
					mediaPopup.body.append($('<ul class="inline-image-library-thumbs">' + html + '</ul>'));
					//mediaPopup.center().show();
					mediaPopup.setClickTargets([icon]);
					mediaPopup.position(icon).show();

				    $('.triggerVideo').click(function() {
						sofia.globals.showVideo(videodetails[$(this).attr('id')][0], $(this).attr('id'), videodetails[$(this).attr('id')][1]);
					});
										
					break;

					// var mediaInfo = mediaForVerse[0],
					// videoUrl = sofia.config.baseContentUrl + 'content/' + 'media/' + mediaLibrary.folder + '/' + mediaInfo.filename + '.' + mediaInfo.exts[0];
					// sofia.globals.showVideo(videoUrl, mediaInfo.name);
					// break;

				case 'jfm':

					var lang = icon.closest('.section').attr('data-lang3'),
						mediaInfo = mediaForVerse[0],
						videoUrl = JesusFilmMediaApi.getPlayer(lang, mediaInfo.filename, function(iframeUrl, iframeLang) {

							if (iframeUrl != null) {
								sofia.globals.showIframe(iframeUrl, mediaInfo.name + ' (' + iframeLang + (lang != iframeLang ? '/' + lang : '') + ')');
							}

						});

					break;

			}
		});

		$('.windows-main').on('click', '.mediathumbtop', function(e) {

			if (mediaPopup.container.is(':visible')) {
				mediaPopup.hide();
				return;
			}

			// clear it out!
			mediaPopup.body.html('');

			var html = '';
			var videodetails = {};
			var icon = $(this);
			
			for (var i=0; i<allVideos.length; i++) {

				var
					verseid = allVideos[i].verseid,
					mediaLibrary = allVideos[i].mediaLibrary,
					mediaForVerse = allVideos[i].mediaForVerse,
					reference = new bible.Reference(verseid, 'eng').toString().split(' ')[0];
					console.log(new bible.Reference(verseid, 'eng').toString())

				var thumbUrl = 'https://img.youtube.com/vi/' + mediaForVerse.url.split('/')[4] + '/0.jpg';
				html += '<li>' + 
							'<img id="' + mediaForVerse.name + '" title="' + mediaForVerse.name + '" class="triggerVideo" src="' + thumbUrl + '"/>' +
						'</li>';
				videodetails[mediaForVerse.name] = [mediaForVerse.url, mediaForVerse.description];
			}
			mediaPopup.body.append('<strong><span style="line-height:2;">' + reference.toString() + '</span></strong><br>');
			mediaPopup.body.append($('<ul class="inline-image-library-thumbs">' + html + '</ul>'));
			//mediaPopup.center().show();
			mediaPopup.setClickTargets([icon]);
			mediaPopup.position(icon).show();
			$('.triggerVideo').click(function() {
				sofia.globals.showVideo(videodetails[$(this).attr('id')][0], $(this).attr('id'), videodetails[$(this).attr('id')][1]);
			});

		});
	}

	// process chapters, add image icon to verses
	function addMedia() {

		//console.log('addMedia',mediaLibraries);

		if (mediaLibraries == null) {
			return;
		}

		while (contentToProcess.length > 0) {
			var content = contentToProcess.pop();

			if ((content.data('textid') != 'english_esv') && (content.data('textid') != 'english_niv')) {

				if (content.data('has-media') != undefined) {
					continue;
				}

				// add images to verses
				content.find('.verse, .v').each(function() {
					var verse = $(this),
						verseid = verse.attr('data-id');
					// make sure we're just doing the first verse
					verse = verse.closest('.section').find('.' + verseid).first();

					if (verseid == 'LK1_1') {
						// //console.log('check');
					}

					

					if (!verse.hasClass('has-media')) {
						// check all libraries
						for (var i=0, il=mediaLibraries.length; i<il; i++) {
							var mediaLibrary = mediaLibraries[i],
								iconClassName = mediaLibrary.iconClassName,
								mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid] : undefined;
							
							// add media
							if (typeof mediaForVerse != 'undefined') {
								// check if it's already been added
								if (verse.closest('.chapter').find('.' + verseid).find('.' + iconClassName).length == 0) {
									if ((mediaLibrary.folder == "video_hindi") || (mediaLibrary.folder == "video_telugu"))  {
										// if (content.data('textid') == 'hindi_irv') {
										// 	var icon = $('<span class="header-icon video-button mediathumbtop" id="' + content.data('textid') +'" data-mediafolder="' + mediaLibrary.folder + '" id="image' + verseid + '"></span>');
										// 		// verseNumber = verse.find('.verse-num, v-num');
										// 	addvideos["textid"] = content.data('textid');
										// 	addvideos["iconClassName"] = iconClassName;
										// 	addvideos["mediaLibrary"] = mediaLibrary.folder;
										// 	addvideos["verseid"] = verseid.substring(0,2) + '1_1';
										// 	console.log(verseid)
										// 	mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid.substring(0,2) + '1_1'] : undefined;
										// 	addvideos["mediaForVerse"] = mediaForVerse;
										// 	allVideos.push(addvideos);
										// }

									}
									else {
										
										var icon = $('<span class="inline-icon ' + iconClassName + ' mediathumb" data-mediafolder="' + mediaLibrary.folder + '" id="image' + verseid + '"></span>'),
											verseNumber = verse.find('.verse-num, v-num');
										if (verseNumber.length > 0) {
											verseNumber.after(icon);
										} else {
											icon.prependTo(verse);
										}										
									}
								}
							}

							else {
								// console.log(mediaLibrary.data);
								
							}

						} // libraries loop


						verse.closest('.section').find('.' + verseid).addClass('has-media');

					}

				}); // verse loop



				content.data('has-media', true);
			}
		} // while
		
	}

	mediaPopup.body.on('click', '.inline-image-library-thumbs a', sofia.globals.mediaImageClick);
	mediaPopup.body.on('click', '.inline-video-library-thumbs a', sofia.globals.mediaVideoClick);


	var ext = {};
	ext = $.extend(true, ext, EventEmitter);
	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload' && e.data.type == 'bible') {
			//store
			contentToProcess.push(e.data.content);
			// run
			addMedia();
		}
	});

	return ext;
}

sofia.plugins.push('MediaLibraryPlugin');
