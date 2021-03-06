sofia.config = $.extend(sofia.config, {

	enableBibleSelectorTabs: true,
	bibleSelectorDefaultList: ['']

});



/******************
TextChooser
*******************/

var TextChooser = function() {
	// create me
	var
		// set by show() function
		container = null,
		text_type = null,
		target = null,

		isFull = false,
		selectedTextInfo = null,
		textChooser = $('<div class="text-chooser nav-drop-list"' +
							'<span class="up-arrow"></span>' +
							'<span class="up-arrow-border"></span>' +
							'<div class="text-chooser-header">' +
								'<div class="text-chooser-selector">' +
									// '<span class="text-chooser-default selected i18n" data-mode="default" data-i18n="[html]windows.bible.default"></span>' +
									'<span class="text-chooser-languages selected i18n" data-mode="languages" data-i18n="[html]windows.bible.languages"></span>' +
									'<span class="text-chooser-versions i18n" data-mode="versions" data-i18n="[html]windows.bible.versions"></span>' +
									// '<span class="text-chooser-countries i18n" data-mode="countries" data-i18n="[html]windows.bible.countries"></span>' +
								'</div>' +
								'<input type="text" style="font-size:14px" class="text-chooser-filter-text i18n" data-i18n="[placeholder]windows.bible.filter" />' +
								'<span class="close-button">Close</span>' +
							'</div>' +
							'<div class="text-chooser-main"></div>' +
						'</div>')
						.appendTo( $('body') )
						.hide(),
		header = textChooser.find('.text-chooser-header'),
		main = textChooser.find('.text-chooser-main'),
		listselector = textChooser.find('.text-chooser-selector'),
		// defaultSelector = textChooser.find('.text-chooser-default'),
		languagesSelector = textChooser.find('.text-chooser-languages'),
		versionsSelector = textChooser.find('.text-chooser-versions'),
		// countriesSelector = textChooser.find('.text-chooser-countries'),
		filter = textChooser.find('.text-chooser-filter-text'),
		title = textChooser.find('.text-chooser-title'),
		closeBtn = textChooser.find('.close-button').hide(),
		allTextsVisible = false,
		hasDefaultTexts = false,
		recentlyUsedKey = 'texts-recently-used',
		recentlyUsed = AppSettings.getValue(recentlyUsedKey, {"recent":[]} ),
		list_data = null;

	//textChooser.find('.i18n').i18n();

	title.html("Texts");

	closeBtn.on('click', hide);

	if (sofia.config.enableBibleSelectorTabs && sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {
		// console.log("yessssssssssssssssss");
		listselector.on('click', 'span', function() {
			$(this)
				.addClass('selected')
				.siblings()
					.removeClass('selected');
			// console.log("********",$(this).addClass('selected'));
			filter
				.val('');

			// if (!Detection.hasTouch) {
			// 	filter.focus();
			// }

			renderTexts(list_data);
		});


	} 
	else {
		listselector.hide();
	}

	$(document).on("click", ".app-list", function(){
		// console.log("app-list");
			filterVersions();
			if (text_type == 'bible'){
				filter.val('Bibles');
				$(".text-chooser-languages").click();
			}
			else{
				filter.val('Study Helps');
			}

		})
	$(document).on("click", ".text-chooser-filter-text", function(){
		// console.log("text-chooser-filter-text");
			filter.val('');
		})

	filter.on('keyup keypress', filterVersions);

	// filter.on('focus', filterVersions);

	/*filter.on('focus', function() {
		
		if (Detection.hasTouch) {
			filter.blur();
		}
		
	});*/

	function filterVersions(e) {

		// when the user presses return and there is only one version, attempt to go to that one
		if (e && e.which == 13) {
			var visibleRows = main.find('.text-chooser-row:visible, .text-chooser-row-divider:visible');

			if (visibleRows.length == 1) {

				visibleRows.click();

				filter.val('');
				return;
			}
		}

		var text = filter.val().toLowerCase();

		if (text == '') {
			console.log("****CHECK****",text_type);
			// renderTexts(list_data);
			// updateRecentlyUsed();

			var arrayOfTexts = list_data;
			var html = [];
			var tempArr = [];

			//Specific condition for our new window
			if (text_type == 'newbible') {
				text_type = 'bible';
			}
			
			// if (text_type == 'bible') {

			for (var i=0, il=arrayOfTexts.length; i<il; i++) {
				if (text_type == arrayOfTexts[i].type) {
					var textInfo = arrayOfTexts[i];

					tempArr.push (
						arrayOfTexts[i]
					);
				}

			}


			result = tempArr.reduce(function (r, a) {
		        r[a.langName] = r[a.langName] || [];
		        r[a.langName].push(a);
		        return r;
		    }, Object.create(null));
			
			// Added by VIPIN for showing the Indian Languages 1st in the dropdown
			if (text_type == "commentary"){
				console.log(result);
				temp = {}
				
				if (result["Indian Languages"]){
					temp["Indian Languages"] = result["Indian Languages"]
					temp["English"] = result["English"]
					console.log(temp);
				}

				result = temp;
				// result.splice(parseInt(j)+1,1);
			}
			console.log("modified",result);
			for (var key in result) {
			    var value = result[key];

				html.push(
					createHeaderRow(
						'',
						key,
						'',
						'',
						''
					)
				);
			    for (var i=0, il=value.length; i<il; i++) {
					if (text_type == value[i].type) {
						var textInfo = value[i];

						html.push (
							createTextRow(textInfo, false, '')
						);
					}

				}

			}
			// } else {

			// 	for (var i=0, il=arrayOfTexts.length; i<il; i++) {
			// 		if (text_type == arrayOfTexts[i].type) {
			// 			var textInfo = arrayOfTexts[i];

			// 			html.push (
			// 				createTextRow(textInfo, false, '')
			// 			);
			// 		}

			// 	}
			// }

			main.html('<table cellspacing="0">' + html.join('') + '</table>');
			
			updateSelectedText();

			// do this after the 'selected' so it's not in the recently used
			updateRecentlyUsed();


		} else {
			console.log("++++++++++++",list_data);

			// filter by type
			var arrayOfTexts = list_data;

			arrayOfTexts = arrayOfTexts.filter(function(t) {

				if (text_type == 'audio') {
					var hasAudio = 	t.hasAudio ||
						typeof t.audioDirectory != 'undefined' ||
						(typeof t.fcbh_audio_ot != 'undefined' || typeof t.fcbh_audio_nt != 'undefined' ||
						 typeof t.fcbh_drama_ot != 'undefined' || typeof t.fcbh_drama_nt != 'undefined');

					return hasAudio == true;
				}

				var thisTextType = typeof t.type == 'undefined' ? 'bible' : t.type;
				return thisTextType == text_type;
			});

			var html = [];

			for (var i=0, il=arrayOfTexts.length; i<il; i++) {
				var textInfo = arrayOfTexts[i],
					hasMatch = 	textInfo.name.toLowerCase().indexOf(text) > -1 ||
								textInfo.abbr.toLowerCase().indexOf(text) > -1 ||
								(textInfo.langNameEnglish && textInfo.langName.toLowerCase().indexOf(text) > -1) ||
								(textInfo.langNameEnglish && textInfo.langNameEnglish.toLowerCase().indexOf(text) > -1);

				if (hasMatch) {
					html.push (
						createTextRow(textInfo, false, '')
					);
				}

			}


			main.html('<table cellspacing="0">' + html.join('') + '</table>');

		}
	}

	// handle when user clicks on a text
	textChooser.on('click', '.text-chooser-row', function() {

		var row = $(this),
			textid = row.attr('data-id');

		if(textid=="comm_hin_dict"){
			$(".text-nav").last().val("अ");
			// अ शब्दावली
		}
		if(textid=="comm_eng_EBD_dict"){
			$(".text-nav").last().val("A");
		}


		row.addClass('selected')
			.siblings()
			.removeClass('selected');


		storeRecentlyUsed(textid);
		updateRecentlyUsed();

		hide();

		TextLoader.getText(textid, function(data) {

			selectedTextInfo = data;
			// console.log(data);
			ext.trigger('change', {type:'change', target: this, data: {textInfo: selectedTextInfo, target: target} });

		});

	});


	function storeRecentlyUsed(textInfo) {

		// if (text_type != 'bible') {
		// 	return;
		// }

		var textid = (typeof textInfo == 'string') ? textInfo : textInfo.id;

		// look for this version
		var existingVersions = recentlyUsed.recent.filter(function(t) {
			return t == textid;
		});

		if (existingVersions.length == 0) {

			// store recent text
			recentlyUsed.recent.unshift(textid);

			// limit to 10
			while (recentlyUsed.recent.length > 10 ) {
				recentlyUsed.recent.pop();
			}
		}

		//console.log('storeRecentlyUsed',recentlyUsed.recent.length);

		// save
		AppSettings.setValue(recentlyUsedKey, recentlyUsed);
	}

	function updateRecentlyUsed() {

		if (list_data == null || text_type == null) {
			return;
		}

		// if (text_type != 'bible' || (getMode() != 'default' && getMode() != 'none')) {
		// 	main.find('.text-chooser-recently-used').remove();
		// 	return;
		// }

		// Recently Used Commentaries/Dictionaries
		if (text_type == 'commentary') {

			// main.find('.text-chooser-recently-used').remove();
			if (recentlyUsed.recent.length > 0) {

			var isDefaultText = false;

			// find if this should be a priority text shown at the beginning
			//if (sofia.config.topTexts && sofia.config.topTexts.length > 0) {
			//	isDefaultText = true;
			//}

			var recentlyUsedHtml =
					createHeaderRow(
						'',
						i18n.t('windows.commentary.recentlyused'),
						'',
						'',
						'text-chooser-recently-used' + (isDefaultText ? ' is-default-text' : '')
					);
			for (var i=0, il=recentlyUsed.recent.length; i<il; i++) {
				var textid = recentlyUsed.recent[i],
					textInfo = list_data.filter(function(ti) { return ti.id == textid; })[0];

				if (textInfo.type == 'commentary' || textInfo.type == 'dictionary') {
					recentlyUsedHtml +=
						createRecentTextRow(textInfo, isDefaultText, 'text-chooser-recently-used' );
				}
			}

			// remove existing
			main.find('.text-chooser-recently-used').remove();

			// add update recent stuff
			var recentRow = $(recentlyUsedHtml);
			main.find('table tbody').prepend(recentRow);
		}
			return;
		}

		// Recently Used Bibles
		else if (text_type == 'bible') {

			// main.find('.text-chooser-recently-used').remove();
			if (recentlyUsed.recent.length > 0) {

				var isDefaultText = false;

				// find if this should be a priority text shown at the beginning
				//if (sofia.config.topTexts && sofia.config.topTexts.length > 0) {
				//	isDefaultText = true;
				//}

				var recentlyUsedHtml =
						createHeaderRow(
							'',
							i18n.t('windows.bible.recentlyused'),
							'',
							'',
							'text-chooser-recently-used' + (isDefaultText ? ' is-default-text' : '')
						);
				for (var i=0, il=recentlyUsed.recent.length; i<il; i++) {
					var textid = recentlyUsed.recent[i],
						textInfo = list_data.filter(function(ti) { return ti.id == textid; })[0];

					if (textInfo.type == 'bible') {
						recentlyUsedHtml +=
							createRecentTextRow(textInfo, isDefaultText, 'text-chooser-recently-used' );
					}
				}

				// remove existing
				main.find('.text-chooser-recently-used').remove();

				// add update recent stuff
				var recentRow = $(recentlyUsedHtml);
				main.find('table tbody').prepend(recentRow);
			}
		}
	}


	function checkIsDefaultText(id) {

		var isDefaultText = true,
			parts = id.split(':'),
			textid = parts.length > 1 ? parts[1] : parts[0];

		// find if this should be a priority text shown at the beginning
		if (sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {

			for (var t=0, tl=sofia.config.bibleSelectorDefaultList.length; t<tl; t++) {
				if (textid == sofia.config.bibleSelectorDefaultList[t]) {
					isDefaultText = true;
					break;
				}
			}

		} else {
			isDefaultText = true;
		}


		return isDefaultText;

	}

	function getMode() {
		if (sofia.config.enableBibleSelectorTabs) {
			var selectedMode = listselector.find('.selected'),
				mode = selectedMode.length > 0 ? selectedMode.data('mode') : 'none';
			return mode;
		} else {
			return 'none';
		}
	}

	function renderTexts(data) {

		if (data == null || typeof data == 'undefined') {
			return;
		}

		// render all the rows
		var html = [],
			arrayOfTexts = data,
			mode = getMode();

		if (mode == 'languages' || mode == 'none') {

			// filter by type
			arrayOfTexts = arrayOfTexts.filter(function(t) {

				if (text_type == 'audio') {
					var hasAudio = t.hasAudio ||
						typeof t.audioDirectory != 'undefined' ||
						(typeof t.fcbh_audio_ot != 'undefined' || typeof t.fcbh_audio_nt != 'undefined' ||
						 typeof t.fcbh_drama_ot != 'undefined' || typeof t.fcbh_drama_nt != 'undefined');

					return hasAudio === true;
				} else {
					if (t.hasText === false) {
						return false;
					}
				}

				var thisTextType = typeof t.type == 'undefined' ? 'bible' : t.type;

				return thisTextType == text_type;
			});
			// console.log(arrayOfTexts);
			// find languages
			var languages = [];
			var native = [];
			for (var index in arrayOfTexts) {
				var text = arrayOfTexts[index];
				// console.log(text);

				/* ORDER BY  English Name */
				var langKey = text.langNameEnglish;
				if (langKey == undefined || langKey == '') {
					langKey = text.langName;
				}

				if (languages.indexOf(langKey) == -1) {
					languages.push( langKey );
					native.push(text.nativeLang);
				}
			}

			// PINNED
			var pinnedLanguages = [];
			if (sofia.config.pinnedLanguages && sofia.config.pinnedLanguages.length && sofia.config.pinnedLanguages.length > 0) {
				// console.log('finding pins');

				for (var i=0, il  = sofia.config.pinnedLanguages.length; i<il; i++) {
					var pinnedLanguage = sofia.config.pinnedLanguages[i];

					var pinnedIndex = languages.indexOf(pinnedLanguage);
					if (pinnedIndex > -1) {
						// console.log(mode);
						if (mode == 'default' || mode == 'none') {
							// pull it out
							languages.splice(pinnedIndex, 1);
						}
						else if (mode == 'languages'){
							languages.splice(pinnedIndex, 1);
						}

						// store for later
						pinnedLanguages.push(pinnedLanguage);
					}
				}
			}


			// put it back in
			if (pinnedLanguages.length > 0) {
				languages.splice.apply(languages, [0, 0].concat(pinnedLanguages));
			}

			// Added by VIPIN for showing the Indian Languages 1st in the dropdown
			// for (var i in languages) {
			// 	if (languages[i] == "Indian Languages"){
			// 		languages.unshift("Indian Languages");
			// 		var j = i;
			// 	}
			// }
			// languages.splice(parseInt(j)+1,1);

			// sort
			// console.log(languages,native);
			languages.sort();
			native.sort();
			// Added by VIPIN for showing the Indian Languages 1st in the dropdown
			for (var i in native) {
				if (native[i] == "Indian Languages"){
					native.unshift("Indian Languages");
					var j = i;
					native.splice(parseInt(j)+1,1);
				}
			}
			var languages1 = [];
			var natives = [];
			$.each(native, function(i, el){
			    if($.inArray(el, natives) === -1) natives.push(el);
			});

			// console.log(languages,natives);
			for (var n in natives){
				for (var v in arrayOfTexts){
					content = arrayOfTexts[v];
					// console.log(content.nativeLang,native[n]);
					if (content.nativeLang == natives[n]){
						// console.log(content.langNameEnglish);
						languages1.push(content.langNameEnglish);
					}
				}
			}
			languages = [];
			$.each(languages1, function(i, el){
			    if($.inArray(el, languages) === -1) languages.push(el);
			});
			// console.log("vsfdvdhgv-----",languages);

			var indian_language = 0;
			var english_language = 0;

			for (var index in languages) {

				// get all the ones with this language
				var langName = languages[index],
					textsInLang = arrayOfTexts.filter(function(t) { return (t.langName == langName || t.langNameEnglish == langName) }),
					hasDefaultText = false,
					langHtml = [];

				// sort the texts by name (it was previous code, below code changed with sort by abbr)
                //  textsInLang = textsInLang.sort(function (a, b) {
                //     if (a.name == b.name) {
                //         return 0;
                //     } else if (a.name > b.name) {
                //         return 1;
                //     } else if (a.name < b.name) {
                //         return -1;
                //     }
                // }); 


                // langNameEnglish: "Indian Languages"

                // create language dropdown and text sort by abbr
                // textsInLang.sort(function(a, b){
                //     if(a.abbr < b.abbr) return -1;
                //     if(a.abbr > b.abbr) return 1;
                //     return 0;
                // })
                // console.log(textsInLang);
				// create HTML for the texts
				for (var textIndex in textsInLang) {
					// console.log(langName);
					var text = textsInLang[textIndex],
						isDefaultText = checkIsDefaultText(text.id);

					if (text_type == 'bible' ) {
						if (mode == 'none' || mode == 'languages' || (isDefaultText && mode == 'default')) {
							// console.log(text,isDefaultText);
							langHtml.push(
								createTextRow(
										text,
										isDefaultText,
										mode == 'languages' ? 'collapsed' : ''
								)
							);
						}

						if (!hasDefaultText && isDefaultText) {
							hasDefaultText = true;
						}
					} else if (text_type == 'deafbible' ) {
						langHtml.push(
							createImageRow(
									text,
									mode == 'languages' ? 'collapsed' : ''
							)
						);

					}
				}

				if (text_type == 'bible' && (mode == 'none' || mode == 'languages' || (hasDefaultText && mode == 'default')) ) {

					var languageDisplayTitle = '';

					// vernacular first
					
					languageDisplayTitle = textsInLang[0].langName +
									( textsInLang[0].langName != textsInLang[0].langNameEnglish && typeof textsInLang[0].langNameEnglish != 'undefined' ? ' (' + textsInLang[0].langNameEnglish + ')' : '');
					

					// english first

					var langName = textsInLang[0].langName,
						langNameEnglish = textsInLang[0].langNameEnglish;

					if (langNameEnglish != '' && langNameEnglish != undefined) {
						languageDisplayTitle = 	langNameEnglish + (langName != langNameEnglish ? ' (' + langName + ')' : '');
					} else {
						languageDisplayTitle = langName;
					}
					// console.log("*******",textsInLang[0].nativeLang);
					if (textsInLang[0].nativeLang == "Indian Languages"){
						if (indian_language == 0){
							html.push(
								createHeaderRow(
									'',
									textsInLang[0].nativeLang,
									'',
									'',
									mode == 'languages' ? '' : ''
								)
							);
							indian_language++;
						}
						
						html.push(
							createHeaderRow(
							'',
							languageDisplayTitle,
							'',
							'',
							mode == 'languages' ? 'collapsible-language collapsed' : ''
							)
						);	
					}						
					else	
						{html.push(
							createHeaderRow(
							'',
							languageDisplayTitle,
							'',
							'',
							mode == 'languages' ? 'collapsible-language collapsed' : ''
							)
						);	
					}
					
				}

				html.push(langHtml.join(''));

			}


			main.html('<table cellspacing="0" class="' + (mode == 'languages' ? 'collapsible' : '') + '">' + html.join('') + '</table>');


			updateSelectedText();

			// do this after the 'selected' so it's not in the recently used
			updateRecentlyUsed();


		}
		else if (mode == "versions"){
			var other_version = 0;
			var english_version = 0;
			// filter by type
			arrayOfTexts = arrayOfTexts.filter(function(t) {

				if (text_type == 'audio') {
					var hasAudio = t.hasAudio ||
						typeof t.audioDirectory != 'undefined' ||
						(typeof t.fcbh_audio_ot != 'undefined' || typeof t.fcbh_audio_nt != 'undefined' ||
						 typeof t.fcbh_drama_ot != 'undefined' || typeof t.fcbh_drama_nt != 'undefined');

					return hasAudio === true;
				} else {
					if (t.hasText === false) {
						return false;
					}
				}

				var thisTextType = typeof t.type == 'undefined' ? 'bible' : t.type;

				return thisTextType == text_type;
			});

			// find languages
			var versions = [];
			for (var index in arrayOfTexts) {
				var text = arrayOfTexts[index];

				/* ORDER BY  English Name */
				var langKey = text.name;
				if (langKey == undefined || langKey == '') {
					langKey = text.langName;
				}

				if (versions.indexOf(langKey) == -1) {
					versions.push( langKey );
				}
			}
			// console.log(versions);

			// PINNED
			var pinnedVersions = [];
			if (sofia.config.pinnedVersions && sofia.config.pinnedVersions.length && sofia.config.pinnedVersions.length > 0) {
				// console.log('finding pins');

				for (var i=0, il  = sofia.config.pinnedVersions.length; i<il; i++) {
					var pinnedVersion = sofia.config.pinnedVersions[i];

					var pinnedIndex = versions.indexOf(pinnedVersion);
					if (pinnedIndex > -1) {

						if (mode == 'versions' || mode == 'none') {
							// pull it out
							versions.splice(pinnedIndex, 1);
						}
						// else if (mode == ''){
						// 	languages.splice(pinnedIndex, 1);
						// }

						// store for later
						pinnedVersion.push(pinnedVersion);
					}
				}
			}


			// put it back in
			if (pinnedVersions.length > 0) {
				versions.splice.apply(versions, [0, 0].concat(pinnedVersions));
			}
			
			// Added by VIPIN for showing the Indian Languages 1st in the dropdown
			// var version=new Array(),v_count = 0;
			// for (var i = 2;i < versions.length;i++){
			// 	version[v_count] = versions[i];
			// 	v_count++;
			// }
			// // sort
			// version.sort();
			// version.unshift(versions[1]);
			// version.unshift(versions[0]);
			
			// // versions.sort();
			// versions = version;
			// console.log(versions.langName);
			for (var index in versions) {

				// get all the ones with this language
				var versName = versions[index],
					textsInVers = arrayOfTexts.filter(function(t) { return (t.name == versName) }),
					hasDefaultText = false,
					versHtml = [];

				// create HTML for the texts
				for (var textIndex in textsInVers) {
				
					var text = textsInVers[textIndex],
						isDefaultText = checkIsDefaultText(text.id);

					if (text_type == 'bible' ) {
						if (mode == 'none' || (isDefaultText && mode == 'versions')) {
							if (versName == "Indian Revised Version" || versName == "Easy-to-Read Version")
							{
							versHtml.push(
								createTextRow(
										text,
										isDefaultText,
										mode == 'versions' ? 'collapsed' : ''
								)
							);
						}
						else{
							versHtml.push(
								createTextRow(
										text,
										isDefaultText,
										mode == 'versions' ? 'collapsed' : ''
								)
							);
						}
						}

						if (!hasDefaultText && isDefaultText) {
							hasDefaultText = true;
						}
					} 
				}

				if (text_type == 'bible' && (mode == 'none' || (hasDefaultText && mode == 'versions')) ) {

					var versionDisplayTitle = '';

					// vernacular first
					
					versionDisplayTitle = textsInVers[0].versName +
									( textsInVers[0].versName != textsInVers[0].name && typeof textsInVers[0].name != 'undefined' ? ' (' + textsInVers[0].name + ')' : '');
					

					// english first

					var versName = textsInVers[0].name,
						langNameEnglish = textsInVers[0].name;

					if (langNameEnglish != '' && langNameEnglish != undefined) {
						versionDisplayTitle = 	langNameEnglish + (versName != langNameEnglish ? ' (' + versName + ')' : '');
					} else {
						versionDisplayTitle = versName;
					}
					// console.log(versName,textsInVers[0].langName);

					if (versName == "Indian Revised Version" || versName == "Easy-to-Read Version")
					{
						html.push(
							createHeaderRow(
								'',
								versionDisplayTitle,
								'',
								'',
								mode == 'versions' ? 'collapsible-version collapsed' : ''
							)
						);
					}
					else if (textsInVers[0].langName == "English" && english_version == 0){
						html.push(
							createHeaderRow(
								'',
								'English Versions',
								'',
								'',
								mode == 'versions' ? 'collapsible-version collapsed' : ''
							)
						);
						english_version++;
					}
					else if (other_version == 0 && textsInVers[0].langName != "English"){
						html.push(
							createHeaderRow(
								'',
								'Other Versions',
								'',
								'',
								mode == 'versions' ? 'collapsible-version collapsed' : ''
							)
						);
						other_version++;
					}
				}

				html.push(versHtml.join(''));

			}


			main.html('<table cellspacing="0" class="' + (mode == 'versions' ? 'collapsible' : '') + '">' + html.join('') + '</table>');


			updateSelectedText();

			// do this after the 'selected' so it's not in the recently used
			updateRecentlyUsed();

		} 
		// else if (mode == "countries") {

		// 	textChooser.removeClass('show-more');

		// 	for (var i=0, il=sofia.countries.length; i<il; i++) {

		// 		var countryInfo = sofia.countries[i],
		// 			textsInCountry = arrayOfTexts.filter(function(t) {
		// 				return typeof t.countries != 'undefined' && t.countries.indexOf(countryInfo["alpha-2"]) > -1;
		// 			});


		// 		if (textsInCountry.length > 0) {
		// 			html.push(
		// 				createHeaderRow(countryInfo["alpha-3"],
		// 					countryInfo.name,
		// 					'',
		// 					'<img src="' + sofia.config.baseContentUrl + 'content/countries/' + countryInfo["alpha-2"].toLowerCase() + '.png" alt="' + countryInfo["alpha-2"] + '" />',
		// 					'country collapsed')

		// 			);

		// 			// order by languages?
		// 			var languagesInCountry = [];

		// 			for (var index in textsInCountry) {
		// 				var text = textsInCountry[index];

		// 				/* ORDER BY  English Name */
		// 				var langKey = text.langNameEnglish;
		// 				if (langKey == undefined || langKey == '') {
		// 					langKey = text.langName;
		// 				}

		// 				if (languagesInCountry.indexOf(langKey) == -1) {
		// 					languagesInCountry.push( langKey );
		// 				}
		// 			}

		// 			languagesInCountry.sort();

		// 			for (var index in languagesInCountry) {

		// 				// get all the ones with this language
		// 				var langName = languagesInCountry[index],
		// 					textsInLang = textsInCountry.filter(function(t) { return (t.langName == langName || t.langNameEnglish == langName) }),
		// 					hasDefaultText = false,
		// 					langHtml = [];


		// 				// LANGUAGE
		// 				var languageDisplayTitle = '';

		// 				// english first
		// 				var langName = textsInLang[0].langName,
		// 					langNameEnglish = textsInLang[0].langNameEnglish;

		// 				if (langNameEnglish != '' && langNameEnglish != undefined) {
		// 					languageDisplayTitle = 	langNameEnglish + (langName != langNameEnglish ? ' (' + langName + ')' : '');
		// 				} else {
		// 					languageDisplayTitle = langName;
		// 				}

		// 				html.push(
		// 					createDividerRow(
		// 						languageDisplayTitle,
		// 						'collapsed'
		// 					)
		// 				);


		// 				// sort the texts by name
		// 				textsInLang = textsInLang.sort(function (a, b) {
		// 					if (a.name == b.name) {
		// 						return 0;
		// 					} else if (a.name > b.name) {
		// 						return 1;
		// 					} else if (a.name < b.name) {
		// 						return -1;
		// 					}
		// 				});

		// 				// create HTML for the texts
		// 				for (var textIndex in textsInLang) {
		// 					var text = textsInLang[textIndex];

		// 					langHtml.push(
		// 						createTextRow(
		// 								text,
		// 								false,
		// 								'collapsed'
		// 						)
		// 					);

		// 					if (!hasDefaultText && isDefaultText) {
		// 						hasDefaultText = true;
		// 					}
		// 				}





		// 				html.push(langHtml.join(''));

		// 			}



		// 			/* simple list in country */
		// 			/*
		// 			for (var textIndex in textsInCountry) {
		// 				var text = textsInCountry[textIndex];

		// 				html.push(
		// 					createTextRow(text, isDefaultText, 'collapsed')
		// 				);

		// 			}
		// 			*/

		// 		}

		// 	}

		// 	main.html('<table cellspacing="0" class="collapsible">' + html.join('') + '</table>');

		// }

	}

	main.on('click', '.collapsible .text-chooser-row-header', function() {

		var header = $(this),
			children = header.nextUntil('.text-chooser-row-header');

		if (header.hasClass('collapsed')) {

			header.removeClass('collapsed');
			children.removeClass('collapsed');

		} else {

			header.addClass('collapsed');
			children.addClass('collapsed');

		}


	});

	function updateSelectedText() {

		// find the selected text
		if (selectedTextInfo != null) {

			textChooser
					.find('table .selected')
					.removeClass('selected');

			textChooser
					.find('[data-id="' + selectedTextInfo.id + '"]')
					.addClass('selected');
		}

	}


	function createTextRow(text, isDefaultText, className) {
		console.log("******create*******");
		var hasAudio = 	text.hasAudio ||
						typeof text.audioDirectory != 'undefined' ||
						(typeof text.fcbh_audio_ot != 'undefined' || typeof text.fcbh_audio_nt != 'undefined' ||
						 typeof text.fcbh_drama_ot != 'undefined' || typeof text.fcbh_drama_nt != 'undefined'),
			hasLemma = text.hasLemma,

			providerName = (typeof text.providerName != 'undefined' && text.providerName != 'local') ? text.providerName : '',
			providerFullName = sofia.textproviders[text.providerName] && sofia.textproviders[text.providerName].fullName ? sofia.textproviders[text.providerName].fullName : '',

			colspan = 4 - (hasAudio ? 1 : 0) - (hasLemma ? 1 : 0) - (providerName != '' ? 1 : 0);

		var html = '<tr class="text-chooser-row' + (isDefaultText ? ' is-default-text' : '') + (className != '' ? ' ' + className : '') + '" data-id="' + text.id + '" data-lang-name="' + text.langName + '" data-lang-name-english="' + text.langNameEnglish + '">' +
					'<td class="text-chooser-abbr">' + text.abbr + '</td>' +
					'<td class="text-chooser-name" ' + (colspan > 1 ? ' colspan="' + colspan + '"' : '') + '>' +
						'<span>' + text.name + '</span>' +
					'</td>' +

					(hasLemma === true ? '<td class="text-chooser-lemma"><span title="' + i18n.t('windows.bible.lemma') + '" data-i18n="[title]windows.bible.lemma"></span></td>' : '') +
					(hasAudio === true ? '<td class="text-chooser-audio"><span title="' + i18n.t('windows.bible.audio') + '" data-i18n="[title]windows.bible.audio"></span></td>' : '') +
					(providerName != '' ? '<td class="text-chooser-provider-' + providerName + '"><span title="' + providerFullName + '"></span></td>' : '') +
				'</tr>';

		return html;
	}

	function createRecentTextRow(text, isDefaultText, className) {
		var hasAudio = 	text.hasAudio ||
						typeof text.audioDirectory != 'undefined' ||
						(typeof text.fcbh_audio_ot != 'undefined' || typeof text.fcbh_audio_nt != 'undefined' ||
						 typeof text.fcbh_drama_ot != 'undefined' || typeof text.fcbh_drama_nt != 'undefined'),
			hasLemma = text.hasLemma,

			providerName = (typeof text.providerName != 'undefined' && text.providerName != 'local') ? text.providerName : '',
			providerFullName = sofia.textproviders[text.providerName] && sofia.textproviders[text.providerName].fullName ? sofia.textproviders[text.providerName].fullName : '',

			colspan = 4 - (hasAudio ? 1 : 0) - (hasLemma ? 1 : 0) - (providerName != '' ? 1 : 0);

		var html = '<tr class="text-chooser-row' + (isDefaultText ? ' is-default-text' : '') + (className != '' ? ' ' + className : '') + '" data-id="' + text.id + '" data-lang-name="' + text.langName + '" data-lang-name-english="' + text.langNameEnglish + '">' +
					'<td class="text-chooser-abbr">' + text.abbr + '</td>' +
					'<td class="text-chooser-name" ' + (colspan > 1 ? ' colspan="' + colspan + '"' : '') + '>' +
						'<span>' + text.name + '</span>' +
					'</td>' +

					(hasLemma === true ? '<td class="text-chooser-lemma"><span title="' + i18n.t('windows.bible.lemma') + '" data-i18n="[title]windows.bible.lemma"></span></td>' : '') +
					(hasAudio === true ? '<td class="text-chooser-audio"><span title="' + i18n.t('windows.bible.audio') + '" data-i18n="[title]windows.bible.audio"></span></td>' : '') +
					(providerName != '' ? '<td class="text-chooser-provider-' + providerName + '"><span title="' + providerFullName + '"></span></td>' : '') +
				'</tr>';

		return html;
	}

	function createImageRow(text, className) {
		var
			providerName = (typeof text.providerName != 'undefined' && text.providerName != 'local') ? text.providerName : '',
			providerFullName = sofia.textproviders[text.providerName] && sofia.textproviders[text.providerName].fullName ? sofia.textproviders[text.providerName].fullName : '',
			imageUrl = 'content/texts/' + text.id + '/' + text.id + '.png';


		var html = '<tr class="text-chooser-row' + (className != '' ? ' ' + className : '') + '" data-id="' + text.id + '" data-lang-name="' + text.langName + '" data-lang-name-english="' + text.langNameEnglish + '">' +
					'<td class="text-chooser-image">' +
						'<img src="' + imageUrl + '" />' +
					'</td>' +
					'<td class="text-chooser-name" >' +
						'<span>' + text.name + '</span>' +
					'</td>' +
				'</tr>';

		return html;
	}



	function createHeaderRow(id, name, englishName, additionalHtml, className) {
		console.log("VIPIN///////////",name,"2",className,"3",id,"4",additionalHtml);
		var html = '<tr class="text-chooser-row-header' + (className != '' ? ' ' + className : '') + '" data-id="' + id + '"><td colspan="5">' +
					'<span class="name">' + name + '</span>' +
					additionalHtml +
					'</td></tr>';


		return html;
	}

	function createDividerRow(name, className) {
		console.log("VIPIN22222",name);
		var html = '<tr class="text-chooser-row-divider ' + (className != '' ? ' ' + className : '') + '">' +
					//'<td>&nbsp;</td>' +
					//'<td colspan="4">' +
					'<td colspan="5">' +
						'<span class="name">' + name + '</span>' +
					'</td>' +
					'</tr>';


		return html;
	}

	function toggle() {

		if (textChooser.is(':visible') ) {
			hide();
		} else {
			show();
		}

	}

	function setTarget(_container, _target, _text_type) {


		var needsToRerender = _text_type != text_type;;

		container = _container;
		target = _target;
		text_type = _text_type;

		ext.setClickTargets([_target, textChooser]);

		if (needsToRerender) {
			renderTexts(list_data);

			if (text_type == 'bible' && sofia.config.enableBibleSelectorTabs && sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {
				listselector
					.find('.text-chooser-languages').click();
				listselector
					.find('.text-chooser-languages')
					.addClass('selected')
						.siblings()
							.removeClass('selected');

				listselector.show();

			} else {

				listselector
					.find('span')
					.removeClass('selected');

				listselector.hide();
			}
		}

	}

	function getTarget() {
		return target;
	}

	function show() {
		//$('.nav-drop-list').hide();

		size();
		textChooser.show();
		ext.onshow();

		if (!list_data) {
			main.addClass('loading-indicator');//.html('Loading');

			TextLoader.loadTexts(function(data) {
				list_data = data;

				// check for countries
				if (sofia.config.enableCountrySelector) {
					var hasCountries = list_data.filter(function(c) { return typeof c.countries != 'undefined' && c.countries.length > 0; }).length > 0;
					if (!hasCountries) {
						listselector.hide();
					}
				}

				main.removeClass('loading-indicator');
				renderTexts(list_data);

			});
		} else {
			main.removeClass('loading-indicator');
		}

		size();
		if (filter.val() != '') {
			filter.val('');
			filterVersions();
		}

		// if (!Detection.hasTouch) {
		// 	filter.focus();
		// }

	}

	function hide() {
		textChooser.hide();
		ext.onhide();
	}

	function setTextInfo(text) {
		selectedTextInfo = text;

		storeRecentlyUsed(selectedTextInfo);
		updateRecentlyUsed();

		updateSelectedText();
	}

	function getTextInfo() {
		return selectedTextInfo;
	}

	function size(width,height) {

		if (target == null || container == null) {
			return;
		}

		//clearOffClickTimer();
		console.log("----------",container.height());
		if (isFull) {

			// cover the container area
			if (!(width && height)) {
				width = container.width();
				height = container.height();
			}

			textChooser
				.width(width)
				.height(height)
				.css({top: container.offset().top,left: container.offset().left});

			main
				.width(width)
				.height(height - header.outerHeight());

		} else {
			console.log(target.offset());
			console.log("99999",target.outerHeight());
			console.log("8989",targetOuterHeight);
			console.log()
			// reasonable size!
			var targetOffset = target.offset(),
				targetOuterHeight = target.outerHeight(),
				win = $(window),
				selectorWidth = textChooser.outerWidth(),

				top = targetOffset.top + targetOuterHeight + 10,
				left = targetOffset.left,
				winHeight = win.height() - 40,
				winWidth = win.width(),
				maxHeight = winHeight - top;

			if (winWidth < left + selectorWidth) {
				left = winWidth - selectorWidth;
				if (left < 0) {
					left = 0;
				}
			}


			textChooser
				.outerHeight(maxHeight)
				.css({top: top,left: left});

			main
				.outerHeight(maxHeight - header.outerHeight());


			// UP ARROW
			var upArrowLeft = targetOffset.left - left + 20;

			textChooser.find('.up-arrow, .up-arrow-border')
				.css({left: upArrowLeft});

		}

	}

	function isVisible() {
		return textChooser.is(':visible');
	}

	function node() {
		return textChooser;
	}

	function close() {
		//textChooser.remove();
		//ext.clearListeners();
	}

	var ext = {
		setTarget: setTarget,
		getTarget: getTarget,
		show: show,
		hide: hide,
		toggle: toggle,
		isVisible: isVisible,
		node: node,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		renderTexts: renderTexts,
		size: size,
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);
	ext = $.extend(true, ext, ClickOff);
	ext.clickoffid = 'version picker';
	ext.on('offclick', function() {
		hide();
	});

	return ext;

};

sofia.initMethods.push(function() {
	sofia.globalTextChooser = new TextChooser();
});
