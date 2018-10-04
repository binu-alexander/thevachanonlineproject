

var CrossReferencePopupPlugin = function(app) {

	if (!sofia.config.enableNotesPopupPlugin) {
		return;
	}

	var referencePopup = new InfoWindow('CrossReferencePopup');
	var verserange = []
	referencePopup.container.css({zIndex: 1000});

	function getFragmentidFromNode(node) {
		var possibleTexts = [node.attr('data-id'), node.attr('title'), node.html()],
			fragmentid = null;

		for (var i=0, il=possibleTexts.length; i<il; i++) {
			var text = possibleTexts[i];

			if (typeof text != 'undefined' && text != null) {
				var bref = new bible.Reference(text.split(';')[0].trim());

				if (typeof bref.toSection != 'undefined')  {

					if (bref.verse2 == -1) {
						fragmentid = bref.toSection();
						verserange = [];
						break;
					}

					else{
						fragmentid = bref.toSection();
						var m=0
						for (var i = bref.verse1; i <= bref.verse2; i++) {
							verserange[m] = i
							m = m+1
						}
						break;
					}
				}
			}

		}
		return fragmentid;
	}

	sofia.globals.handleBibleRefClick = function(e) {
		var link = $(this),
			newfragmentid = getFragmentidFromNode(link);

		// where are we?
		var currentLocationData = PlaceKeeper.getFirstLocation();

		// store the current one
		// TextNavigation.locationChange(currentLocationData.fragmentid);


		if (newfragmentid != null && newfragmentid != '') {

			TextNavigation.locationChange(newfragmentid);

			ext.trigger('globalmessage', {
								type: 'globalmessage',
								target: this,
								data: {
									messagetype:'nav',
									type: 'bible',
									locationInfo: {
										fragmentid: newfragmentid,
										sectionid: newfragmentid.split('_')[0],
										offset: 0
									}
								}
							});
		}
	};


	sofia.globals.handleBibleRefMouseover = function(e, textid) {

		if ($(this).attr('data-id').indexOf("bibleJsn") > 0) {
			// referencePopup.body.html('');
			// var dataIdVal = $(this).attr('data-id').split('_');
			// let languageCode = $(this).parent().parent().attr('data-lang3');
			// var popupData = [];
			// var fileName;
			// fileName = ["guj_bible_wbtc","hin_bible_bsi","hin_bible_wbtc","kan_bible_bsi","kan_bible_wbtc","mal_bible_bsi","mar_bible_wbtc","pan_bible_wbtc","tam_bible_bsi","tam_bible_wbtc","tel_bible_bsi","tel_bible_wbtc","test"];
			// var popupHide = 0;
			// for (var i=0; i < fileName.length; i++) {
			// 	var langCode = fileName[i].split('_')[0];
			// 	if (langCode == languageCode){
					
			// 		$.getJSON("./copy_right_bibles/"+fileName[i]+".json", function (data) {
			// 			json_obj = data;
			//     		if (json_obj[languageCode]){
			// 	    		var bibleVersion = Object.keys(json_obj[languageCode][0])[0];
			// 					Object.entries(json_obj[languageCode][0]).forEach(([key, val]) => {
			// 				    var copyRightYear = Object.values(val[0][Object.keys(val[0])[0]][0])[0];
			// 				    var bibleVersion = key;
			// 				    var versePing = "";
			// 				    if (val[0][dataIdVal[0]]){
			// 				    	versePing = val[0][dataIdVal[0]][0][dataIdVal[1]][0][dataIdVal[2]];
			// 				    }else{
			// 				    	popupHide += 1;
			// 				    }
			// 				    var popupContent = '<b>v'+dataIdVal[2]+'</b> ' + '<span style="color:#3232ff;">'+versePing + '</span> <span style="font-size:10px;">' + bibleVersion.toUpperCase() + ' ©' + copyRightYear + '</span><br>'
			// 				    popupData.push(popupContent);
			// 				});
			// 	    		referencePopup.body.html(popupData);
			// 	    	}
			// 		}).fail(function(e, g) { console.log(g); });
			// 	}
			// };
			// // }
			// if (popupHide == 0){
			// 	referencePopup.show();
			// 	referencePopup.position($(this));
			//  }
		} else {

			var link = $(this),
			fragmentid = getFragmentidFromNode(link);

			if (fragmentid != null) {

				var sectionid = fragmentid.split('_')[0];

				if (typeof textid == 'undefined') {

					if (link.closest('.section').hasClass('commentary')) {

						// textid = $('.BibleWindow:first .section:first').attr('data-textid');
						
						// Above code I (udkumar@hotmail.com) commented because default 
						// windows setting changed and on hover from hindi notes we ned irv in reference
						textid = $('.BibleWindow:eq(1) .section').attr('data-textid');

					} else {
						textid = link.closest('.section').attr('data-textid');
					}
				}


				// console.log('hover', textid, sectionid, fragmentid);
				// var versionName = $('.BibleWindow:first .section:first').attr('data-lang3');

				// Above code I (udkumar@hotmail.com) commented because default 
				// windows setting changed and on hover from hindi notes we ned irv in reference
				var versionName = $('.BibleWindow:eq(1) .section').attr('data-lang3');
				var versionCode = textid.split("_")[1];
				var bibleVersion = versionName +"-"+ versionCode;

				TextLoader.getText(textid, function(textInfo) {

					TextLoader.loadSection(textInfo, sectionid, function(contentNode) {

						var html = '';
						var verse = '';

						if (verserange.length > 0) {
							for (var j = 0; j< verserange.length; j++ ){
								fragmentid = sectionid + "_" + verserange[j]
								verse = contentNode.find('.' + fragmentid)
								verse.find('.note').remove();
								verse.each(function() {
								html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + verserange[j] +  "</span> &nbsp;" + $(this).html();
								});
								html += "<span style='font-size:10px;'>&nbsp;&nbsp;</span>"
							}
							
						}
						else{
							verse = contentNode.find('.' + fragmentid)
							verse.find('.note').remove();
							verse.each(function() {
							html += $(this).html();
							});
							html += "<span style='font-size:10px;'></span>"
						}
						verserange = [];
						
						// html += "<span style='font-size:10px;'> "+bibleVersion.toUpperCase() +" ©" + "2018</span>"

						referencePopup.body.html( html );
						referencePopup.show();
						referencePopup.position(link);
						html = '';

					});
				});
			}	
		}

	}

	sofia.globals.handleBibleRefMouseout = function(e) {

		referencePopup.hide();
	}


	$('.windows-main').on('click','.bibleref, .xt', sofia.globals.handleBibleRefClick);

	if (!Detection.hasTouch) {
		$('.windows-main').on('mouseover','.bibleref, .xt', sofia.globals.handleBibleRefMouseover);
		$('.windows-main').on('mouseout','.bibleref, .xt', sofia.globals.handleBibleRefMouseout);
	}


	var ext = {
		getData: function() {
			return null;
		}
	};
	ext = $.extend(true, ext, EventEmitter);

	return ext;
};

sofia.plugins.push('CrossReferencePopupPlugin');
