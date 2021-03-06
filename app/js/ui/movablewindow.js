var MovableWindow = function(width,height,titleText, id, footerText) {

	width = width || 300;
	height = height || 200;
	
	titleText = titleText || '';
	footerText = footerText || '';
	visiblestyle = 'visibility:hidden';
	if ((id == 'video-player') && (width > 500)) {
		visiblestyle = 'visibility:visible';
	}

	var container = $(	'<div class="movable-window" ' + (id ? ' id="' + id + '"' : '') + '>' +
							'<div class="movable-header">' +
								'<span class="movable-header-title">' + titleText + '</span>' +
								'<div class="normal-icon normal-info-button" style="' + visiblestyle + '"></div>'+
								'<div class="popup-overlay"><div class="popup-content">Pop-Up</div></div>' +
								'<span class="close-button"></span>' +
							'</div>' +
							'<div class="movable-body"></div>' +
							'<div class="movable-footer">' +
								footerText +
							'</div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),
		header = container.find('.movable-header'),
		title = container.find('.movable-header-title'),
		infoBtn = container.find('.normal-info-button'),
		body = container.find('.movable-body'),
		footer = container.find('.movable-footer'),
		close = container.find('.close-button'),
		win = $(window),
		doc = $(document),

		startWindowPosition = null,
		startMousePosition = null;

	if (!Detection.hasTouch) {

		header.on('mousedown', function(e) {
			doc
				.on('mousemove', move)
				.on('mouseup', mouseup);

			startWindowPosition = container.offset();
			startMousePosition = {x:e.clientX, y:e.clientY};
		});
		function mouseup() {
			doc
				.off('mousemove', move)
				.off('mouseup', mouseup);
		}

	}
	else {
		header.on('touchstart', function(e) {
			doc
				.on('touchmove', move)
				.on('touchend', mouseup);

			startWindowPosition = container.offset();
			startMousePosition = {x:e.clientX, y:e.clientY};
		});
		function mouseup() {
			doc
				.off('touchmove', move)
				.off('touchend', mouseup);
		}
	}

	infoBtn.on('mouseover', function() {
		$(".popup-overlay, .popup-content").addClass("active");
    	$(".popup-content").fadeIn(2000);
	});

	infoBtn.on('mouseout', function() {
		$(".popup-overlay, .popup-content").removeClass("active");
	});


	function mouseup() {
		doc
			.off('mousemove, touchmove', move)
			.off('mouseup, touchend', mouseup);
	}

	function move(e) {
		// handle move
		//console.log(e);

		container.css({
			top: startWindowPosition.top - (startMousePosition.y - e.clientY),
			left: startWindowPosition.left - (startMousePosition.x - e.clientX)
		});
	}

	close.on('click', hide);


	function size(width, height) {

		body.width(width);
		body.height(height);

		return ext;
	}
	size(width, height);
	center();

	function show() {
		container.show();
		return ext;
	}
	function hide() {
		container.hide();
		return ext;
	}
	function center() {
		var
			infoWidth = container.outerWidth(),
			infoHeight = container.outerHeight(),
			top = win.height()/2 - infoHeight/2,
			left = win.width()/2 - infoWidth/2;

		if (top < 0) {
			top = 0;
		}
		if (left < 0) {
			left = 0;
		}

		container.css({
			top: top,
			left: left
		});

		return ext;
	}

	var ext = {
		show: show,
		hide: hide,
		size: size,
		container: container,
		body: body,
		title: title,
		footer: footer,
		center: center,
		closeButton: close
	};

	return ext;

};
