

var CrossReferencePopupPlugin = function(app) {

	if (!sofia.config.enableNotesPopupPlugin) {
		return;
	}

	var referencePopup = new InfoWindow('CrossReferencePopup');
	window.verserange = [];
	referencePopup.container.css({zIndex: 1000});

	function getFragmentidFromNode(node) {
		var possibleTexts = [node.attr('data-id'), node.attr('title'), node.html()],
			fragmentid = null;

		for (var i=0, il=possibleTexts.length; i<il; i++) {
			var text = possibleTexts[i];
			
			// Code changed by Samuel and Vipin for the comma seperated references
			var commaverses = '';
			if (typeof text != 'undefined' && text != null) {
				var bref = new bible.Reference(text.split(';')[0].trim());
				commaverses = text.split('_')[1].split(',');
				
				if (typeof bref.toSection != 'undefined')  {

					if (bref.verse2 == -1) {
						fragmentid = text.split(',')[0];
						var n=0
						if (commaverses != 'undefined') {
							for (var i=0;i<commaverses.length;i++){
								verserange[n] = commaverses[i]
								n = n + 1
								}
							}
						// else{
						// 	console.log("SINGLE");
						// 	verserange = [];
						// }
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
		// console.log($(this).attr('data-id').indexOf("bibleJsn"));
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
			var textids = null;

			console.log(link.closest('.section').hasClass('commentary'));

			if (fragmentid != null) {

				var sectionid = fragmentid.split('_')[0];

				if (typeof textid == 'undefined') {
					console.log("section-textid",link.closest('.section').attr('data-textid'));

					if (link.closest('.section').hasClass('commentary')) {

						// textid = $('.BibleWindow:first .section:first').attr('data-textid');
						// Above code I (udkumar@hotmail.com) commented because default 
						// windows setting changed and on hover from hindi notes we ned irv in reference

						textid = $('.BibleWindow:eq(1) .section').attr('data-textid');

						// Uncomment the below code if you want the hindi dictionary pop-up to display only hindi irv bible in crossreferences
						if (link.closest('.section').attr('data-textid') == "comm_hin_dict"){
							textid = "hindi_irv"
						}
						else if (link.closest('.section').attr('data-textid') == "comm_eng_EBD_dict" || link.closest('.section').attr('data-textid') == "comm_tske_eng"){
							textid = "english_ulb"
						}

					} else {

						textid = link.closest('.section').attr('data-textid');
					}
				}

				if ($('.BibleWindow:eq(1) .section').attr('data-textid') == "hindi_irv") {
					if ((link.closest('.section').attr('data-textid') != "comm_hin_dict") && (link.closest('.section').attr('data-textid') != "comm_eng_EBD_dict")) {
						textids = ["hindi_irv","hindi_wbt"];
					}
				}

				console.log($('.BibleWindow:eq(1) .section').attr('data-textid'));
				console.log('hover',textid,sectionid,fragmentid);

				// var versionName = $('.BibleWindow:first .section:first').attr('data-lang3');
				console.log(textids,$('.BibleWindow:eq(1) .section').attr('data-textid'),textid);
				// Above code I (udkumar@hotmail.com) commented because default 
				// windows setting changed and on hover from hindi notes we ned irv in reference
				if ((textids != null || link.closest('.section').attr('data-textid')=='comm_hin_dict') && textid == "hindi_irv") {
					textids = ["hindi_irv","hindi_wbt"];
					var html = '';
					var verse = '';
					for (let i = 0; i < textids.length; i++ ) {
						textid = textids[i];
						TextLoader.getText(textid, function(textInfo) {
							TextLoader.loadSection(textInfo, sectionid, function(contentNode) {
								let versionName = $('.BibleWindow:eq(1) .section').attr('data-lang3');
								let versionCode = textInfo.id.split("_")[1];
								let bibleVersion = versionName +"-"+ versionCode;

								if (verserange.length > 0) {
									for (var j = 0; j< verserange.length; j++ ){
										fragmentid = sectionid + "_" + verserange[j]
										verse = contentNode.find('.' + fragmentid)
										verse.find('.note').remove();
										html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + verserange[j] +  "</span> &nbsp;<span style='font-size:100%;'>";
										verse.each(function() {
											html += $(this).html();
										});
										html += "</span><span style='font-size:10px;'>&nbsp;&nbsp;</span>"
									}								
								}
								else{
									verse = contentNode.find('.' + fragmentid)
									verse.find('.note').remove();
									html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + fragmentid.split('_')[1] +  "</span> &nbsp;<span style='font-size:100%;'>";
									verse.each(function() {
										 html += $(this).html();
									});
									html += "</span><span style='font-size:10px;'></span>"
								}
								// verserange = [];
								if (versionCode == 'irv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> HIN-IRV </span><br>"; }
								else if (versionCode == 'wbt') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> HIN-ERV </span><br>"; }
								versionCode = "";
								referencePopup.body.html(html);
								referencePopup.show();
								referencePopup.position(link);		
							});		
						});
					}	
				}
				// I (vipinpaul95@gmail.com) have added this code for viewing the cross-reference in
				// same language and only for the selective languages.
				else if(textids != null && textid == "english_niv") {
					textids = ["english_esv","english_kjv"];
					var html = '';
					var verse = '';
					for (let i = 0; i < textids.length; i++ ) {
						textid = textids[i];
						TextLoader.getText(textid, function(textInfo) {
							TextLoader.loadSection(textInfo, sectionid, function(contentNode) {
								let versionName = $('.BibleWindow:eq(1) .section').attr('data-lang3');
								let versionCode = textInfo.id.split("_")[1];
								let bibleVersion = versionName +"-"+ versionCode;

								if (verserange.length > 0) {
									for (var j = 0; j< verserange.length; j++ ){
										fragmentid = sectionid + "_" + verserange[j]
										verse = contentNode.find('.' + fragmentid)
										verse.find('.note').remove();
										html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + verserange[j] +  "</span> &nbsp;<span style='font-size:100%;'>";
										verse.each(function() {
											html += $(this).html();
										});
										html += "</span><span style='font-size:10px;'>&nbsp;&nbsp;</span>"
									}								
								}
								else{
									verse = contentNode.find('.' + fragmentid)
									verse.find('.note').remove();
									html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + fragmentid.split('_')[1] +  "</span> &nbsp;<span style='font-size:100%;'>";
									verse.each(function() {
										 html += $(this).html();
									});
									html += "</span><span style='font-size:10px;'></span>"
								}
								verserange = [];
								if (versionCode == 'esv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> ENG-ESV </span><br>"; }
								else if (versionCode == 'kjv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> ENG-KJV </span><br>"; }
								versionCode = "";
								referencePopup.body.html(html);
								referencePopup.show();
								referencePopup.position(link);		
							});		
						});
					}	
				}
				else if(textid == "english_ulb") {
					textids = ["english_esv","english_niv","english_kjv"];
					var html = '';
					var verse = '';
					for (let i = 0; i < textids.length; i++ ) {
						textid = textids[i];
						TextLoader.getText(textid, function(textInfo) {
							TextLoader.loadSection(textInfo, sectionid, function(contentNode) {
								let versionName = $('.BibleWindow:eq(1) .section').attr('data-lang3');
								let versionCode = textInfo.id.split("_")[1];
								let bibleVersion = versionName +"-"+ versionCode;
								console.log("verserange",verserange,"dchgd",verserange.length);
								if (verserange.length > 0) {
									for (var j = 0; j< verserange.length; j++ ){
										fragmentid = sectionid + "_" + verserange[j]
										verse = contentNode.find('.' + fragmentid)
										verse.find('.note').remove();
										html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + verserange[j] +  "</span> &nbsp;<span style='font-size:100%;'>";
										verse.each(function() {
											html += $(this).html();
										});
										html += "</span><span style='font-size:10px;'>&nbsp;&nbsp;</span>"
									}								
								}
								else{
									verse = contentNode.find('.' + fragmentid)
									verse.find('.note').remove();
									html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + fragmentid.split('_')[1] +  "</span> &nbsp;<span style='font-size:100%;'>";
									verse.each(function() {
										 html += $(this).html();
									});
									html += "</span><span style='font-size:10px;'></span>"
								}
								// verserange = [];
								if (versionCode == 'esv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> ENG-ESV </span><br>"; }
								else if (versionCode == 'niv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> ENG-NIV </span><br>"; }
								else if (versionCode == 'kjv') { html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'> ENG-KJV </span><br>"; }
								versionCode = "";
								referencePopup.body.html(html);
								referencePopup.show();
								referencePopup.position(link);		
							});		
						});
					}	
				}
				// else if (textid == "english_niv"){
				// 	var versionName = $('.BibleWindow:eq(1) .section').attr('data-lang3');
				// 	var versionCode = textid.split("_")[1];
				// 	var bibleVersion = versionName +"-"+ versionCode;

				// 	TextLoader.getText(textid, function(textInfo) {

				// 		TextLoader.loadSection(textInfo, sectionid, function(contentNode) {

				// 			var html = '';
				// 			var verse = '';

				// 			if (verserange.length > 0) {
				// 				for (var j = 0; j< verserange.length; j++ ){
				// 					fragmentid = sectionid + "_" + verserange[j]
				// 					verse = contentNode.find('.' + fragmentid)
				// 					verse.find('.note').remove();
				// 					html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + verserange[j] +  "</span> &nbsp;<span style='font-size:100%;'>";
				// 					verse.each(function() {
				// 						html += $(this).html();
				// 					});
				// 					html += "</span><span style='font-size:10px;'>&nbsp;&nbsp;</span>"
				// 				}
								
				// 			}
				// 			else{
				// 				verse = contentNode.find('.' + fragmentid)
				// 				verse.find('.note').remove();
				// 				html += "<span style='color:#3232ff;font-size:80%;font-weight:bold'>" + fragmentid.split('_')[1] +  "</span> &nbsp;<span style='font-size:100%;'>";
				// 				verse.each(function() {
				// 					 html += $(this).html();
				// 				});
				// 				html += "</span><span style='font-size:10px;'></span>"
				// 			}
				// 			verserange = [];
							
				// 			// html += "<span style='font-size:10px;'> "+bibleVersion.toUpperCase() +" ©" + "2018</span>"

				// 			referencePopup.body.html( html );
				// 			referencePopup.show();
				// 			referencePopup.position(link);
				// 			html = '';

				// 		});
				// 	});
				// }
				
			}	
		}

	}

	sofia.globals.handleBibleRefMouseout = function(e) {

		// referencePopup.hide();
	}


	$('.windows-main').on('click','.bibleref, .xt', sofia.globals.handleBibleRefClick);

	// if (!Detection.hasTouch) {
	$('.windows-main').on('mouseover','.bibleref, .xt', sofia.globals.handleBibleRefMouseover);
	$('.windows-main').on('mouseout','.bibleref, .xt', sofia.globals.handleBibleRefMouseout);
	// }


	var ext = {
		getData: function() {
			return null;
		}
	};
	ext = $.extend(true, ext, EventEmitter);

	return ext;
};

sofia.plugins.push('CrossReferencePopupPlugin');