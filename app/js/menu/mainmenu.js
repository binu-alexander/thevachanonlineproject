var MainMenu = function(node) {

	// simply create all 'menuComponents' define below
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}

	var ext = {

	};

	ext = $.extend(true, ext, EventEmitter);
	return ext;

};


var MainMenuButton = function(node) {
	var
		body = $(document.body),
		win = $(window),

		container = $('.windows-container'),
		mainMenuLogo = $('<div id="app-logo"><div id=logo style="width: 255px;height: 35px;margin-left: 12px;margin-top:14px;"></div></div><div id="app-logo-icon" class="hidden-sm hidden-md"></div>') // browser view V logo
					.appendTo(node),
		mobileMenuLogo = $('<div id="app-logo"></div><div id="app-mobile-logo"></div>') // mobile view V logo
					.appendTo(node),			
		mainMenuButton = $('<div id="main-menu-button"><div id="menu" style="position:absolute;float: left;margin: 4px;padding: 15px;width: 50px;height: 50px;border: 1px;z-index: 1000;"></div></div>')
					.appendTo(node)
					.on('click', mainMenuClick),
		mainMenuDropDown = $('<div id="main-menu-dropdown">' +
								'<div class="main-menu-heading i18n" data-i18n="[html]menu.labels.addwindow">Add Window</div>' +
								'<div id="main-menu-windows-list" class="main-menu-list"></div>' +
								'<div class="main-menu-heading i18n" data-i18n="[html]menu.labels.options"></div>' +
								'<div id="main-menu-features" class="main-menu-list"></div>' +
							'</div>')
							.appendTo( body )
							.hide();


	function mainMenuClick(e) {

		if (mainMenuDropDown.is(':visible')) {
			hide();
		} else {
			show();
		}
	}

	function show() {
		mainMenuButton.addClass('active');
		mainMenuDropDown.show();
		ext.onshow();
	}

	function hide() {
		mainMenuButton.removeClass('active');
		mainMenuDropDown.hide();
		ext.onhide();
	}

	mainMenuDropDown.on('click', '.main-menu-item', function() {
		hide();
	});


	var ext = {};
	ext = $.extend(true, ext, EventEmitter);
	ext = $.extend(true, ext, ClickOff);
	ext.clickoffid = 'version picker';
	ext.on('offclick', function() {
		hide();
	});
	ext.setClickTargets([mainMenuButton, mainMenuDropDown]);

	return ext;

}


sofia.menuComponents.push('MainMenuButton');
