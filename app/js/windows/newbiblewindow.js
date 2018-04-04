sofia.config = $.extend(sofia.config, {
	enableNewBibleWindow: true,
	NewBibleWindowDefaultBibleFragmentid: 'TT',
	NewBibleWindowDefaultBibleVersion: 'bengali_ulb'
});

var NewBibleWindow = function(id, node, init_data) {

	 var window =  new TextWindow(id, node, init_data, 'newbible');

	// node.node.on('click', '.deaf-video-header input', function() {
	// 	var button = $(this),
	// 		url = button.attr('data-src'),
	// 		video = button.closest('.deaf-video').find('video');

	// 	button
	// 		.addClass('active')
	// 		.siblings()
	// 			.removeClass('active');

	// 	console.log(url, video);

	// 	video.attr('src', url);
	// });

	 return window;

};

sofia.initMethods.push(function() {

	if (sofia.config.enableNewBibleWindow)	{
		sofia.windowTypes.push({
			className:'NewBibleWindow',
			param: 'newbible',
			paramKeys: {
				'textid': 't',
				'fragmentid':'v'
			},
			init: {
				'textid': sofia.config.NewBibleWindowDefaultBibleVersion,
				'fragmentid': sofia.config.NewBibleWindowDefaultBibleFragmentid
			}
		});
	}
});


