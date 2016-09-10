$("#backtotop").click(function () {
   $("html, body").animate({scrollTop: 0}, 1000);
});

$(window).on('load', function(){
	$('#h-loader').fadeOut(4000);
});

function showImages(el) {
	if($(window).width()>768) {
	    var windowHeight = $(window).height();

	    $(el).each(function(){
	        var thisPos = $(this).offset().top;

	        var topOfWindow = $(window).scrollTop();
	        if (topOfWindow + windowHeight - 100 > thisPos) {
	            $(this).addClass("fadeIn");
	        }
	    });
	} else {
		$(el).css("visibility", "visible");
	}
}

$(document).ready(function(){
	showImages('.load');
});

$(window).scroll(function() {
    showImages('.load');
});
