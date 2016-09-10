$("#backtotop").click(function () {
   $("html, body").animate({scrollTop: 0}, 1000);
});

if($(body).length){ (function(){

	$('.feel-slider').mousemove(function(e){
		var pos = e.pageX / $(window).width() * 100 + '%';
		$('.feel-slider .image-2').css('width', pos);
		$('.feel-slider .slidebar').css('left', pos);
	});

	$('.feel-slider').mouseleave(function(e){
		$('.feel-slider .image-2').css('width', '60%');
		$('.feel-slider .slidebar').css('left', '60%');
	});

	$('.feel-switcher a').click(function(e){
		var id = $(this).attr('id').substring(7);

		$('.feel-switcher a').removeClass('active');
		for (var i = id; i >= 0; i--) {
			$('.feel-switcher a:nth-child(' + i + ')').addClass('active');
		}

		$('.feel-slider .feels:visible').fadeOut(200, function() { $('.feel-slider #feel-' + id).fadeIn(200); });

		return false;
	});

})();}