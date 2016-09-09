/*jslint browser: true*/
/*jslint white: true */
/*global $,jQuery,ozy_headerType,headerMenuFixed,Parallax,alert,$OZY_WP_AJAX_URL,$OZY_WP_IS_HOME,$OZY_WP_HOME_URL,addthis*/

/* Adventure WordPress Theme Main JS File */

/**
* Call Close Fancybox
*/
function close_fancybox(){
	"use strict";
	jQuery.fancybox.close();
}

/* 
Some of dynamic elements like essential grid are not
sizing correctly when you refresh the page and jump to
another tab and back. Following handlers will fix it.
*/
window.onblur = function(){ jQuery(window).resize(); }  
window.onfocus = function(){ jQuery(window).resize(); }

/**
* Read cookie
*
* @key - Cookie key
*/
function getCookieValue(key) {
	"use strict";
    var currentcookie = document.cookie, firstidx, lastidx;
    if (currentcookie.length > 0)
    {
        firstidx = currentcookie.indexOf(key + "=");
        if (firstidx !== -1)
        {
            firstidx = firstidx + key.length + 1;
            lastidx = currentcookie.indexOf(";", firstidx);
            if (lastidx === -1)
            {
                lastidx = currentcookie.length;
            }
            return decodeURIComponent(currentcookie.substring(firstidx, lastidx));
        }
    }
    return "";
}

/**
* Cookie checker for like system
*
* @post_id - WordPress post ID
*/
function check_favorite_like_cookie(post_id) {
	"use strict";	
	var str = getCookieValue( "post_id" );
	if(str.indexOf("[" + post_id + "]") > -1) {
		return true;
	}
	
	return false;
}

/**
* Cokie writer for like system
*
* @post_id - WordPress post ID
*/
function write_favorite_like_cookie(post_id) {
	"use strict";	
	var now = new Date();
	now.setMonth( now.getYear() + 1 ); 
	post_id = "[" + post_id + "]," + getCookieValue("post_id");
	document.cookie="post_id=" + post_id + "; expires=" + now.toGMTString() + "; path=/; ";
}

/**
* Like buttons handler
*
* @post_id - WordPress post ID
* @p_post_type
* @p_vote_type
* @$obj
*/
function ajax_favorite_like(post_id, p_post_type, p_vote_type, $obj) {
	"use strict";	
	if( !check_favorite_like_cookie( post_id ) ) { //check, if there is no id in cookie
		jQuery.ajax({
			url: ozy_headerType.$OZY_WP_AJAX_URL,
			data: { action: 'ozy_ajax_like', vote_post_id: post_id, vote_post_type: p_post_type, vote_type: p_vote_type },
			cache: false,
			success: function(data) {
				//not integer returned, so error message
				if( parseInt(data,0) > 0 ){
					write_favorite_like_cookie(post_id);
					jQuery('span', $obj).text(data);
				} else {
					alert(data);
				}
			},
			error: function(MLHttpRequest, textStatus, errorThrown){  
				alert("MLHttpRequest: " + MLHttpRequest + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown); 
			}  
		});
	}
}

/**
* Load more button handler
*
* @order
* @orderby
* @item_count
* @category_name
* @offset
* @found
* @e
* @layout_type
*/
function ozy_ajax_load_more_blog(order, orderby, item_count, category_name, offset, found, e, layout_type, fitRows) {
	
	jQuery.ajax({
		url: ozy_headerType.$OZY_WP_AJAX_URL,
		data: { action: 'adventure_ajax_load_more', p_order : order, p_orderby : orderby, p_item_count : item_count, p_category_name : category_name, p_offset : offset, p_layout_type : layout_type},
		cache: false,
		success: function(data) {
			
			jQuery('.wpb_wrapper.isotope').append(data);
			
			if(layout_type === 'portfolio') {
				ozy_page_template_page_portfolio_init();
			}else{
				ozy_page_template_page_isotope_blog_init(fitRows);
			}
			
			jQuery(e).text( jQuery(e).data('loadmorecaption') );
			
			if((item_count + offset) >= found) {
				jQuery(e).hide();
			}
			
			var load_more_button_top_pos = e.position();
			jQuery('html, body').animate({scrollTop: load_more_button_top_pos.top }, 'slow');
			
		},
		error: function(MLHttpRequest, textStatus, errorThrown){  
			alert(errorThrown); 
		}  
	});	

}

function ozy_ajax_load_more_blog_action() {
	jQuery(".load_more_blog").click(function(e) {		

		e.preventDefault();
		
		jQuery(this).text( jQuery(this).data('loadingcaption') );
		
		var order 			= jQuery(this).data("order");
		var orderby 		= jQuery(this).data("orderby");
		var item_count 		= jQuery(this).data("item_count");
		var excerpt_length 	= jQuery(this).data("excerpt_length");
		var category_name 	= jQuery(this).data("category_name");
		var offset 			= jQuery(this).data("offset");
		var found 			= jQuery(this).data("found");
		var layout_type 	= jQuery(this).data("layout_type");
		var	fitRows		 	= jQuery(this).data("fitrows");

		offset = offset + item_count;
		ozy_ajax_load_more_blog(order, orderby, item_count, category_name, offset, found, jQuery(this), layout_type, fitRows);
		jQuery(this).data("offset", offset);		

		return false;
		
	});	
}

function ozy_page_template_page_portfolio_init() {
	var $container_portfolio, visible_item_count = 8;
	jQuery('.isotope').each(function() {			
		var $that = jQuery(this);
		$that.imagesLoaded( function() {
			var conf_arr = {
				filter:  '',
				itemSelector: '.ozy_portfolio',
				layoutMode: 'masonry',
				masonry: {}
			};				
			if($that.hasClass('custom-gutter')) {
				visible_item_count = parseInt($that.data('visible_item_count')) + 2;
				conf_arr['masonry'] = {
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer'
				};
			}else{
				visible_item_count = $that.data('visible_item_count');					
				conf_arr['masonry'] = {
					gutter:0
				};
			}
			conf_arr['filter'] = jQuery('.ozy-portfolio-listing').length>0 ? ':nth-child(-n+'+ visible_item_count +')' : '';
			jQuery('.isotope.loaded-already').isotope('destroy');
			$container_portfolio = $that.addClass('loaded-already').isotope(conf_arr);
			
			jQuery('.load_more_blog').animate({opacity:1}, 300, 'easeInOutExpo');
			
			if(jQuery('.ozy-portfolio-listing').length<=0) {
				jQuery('#portfolio-filter a').each(function() {
					if(!jQuery('.isotope>div' + jQuery(this).data('filter')).length) {
						jQuery(this).addClass('disabled').parent('li').animate({opacity:'.3'}, 300, 'easeInOutExpo');
					}else{
						jQuery(this).removeClass('disabled').parent('li').animate({opacity:'1'}, 300, 'easeInOutExpo');
					}
				});
			}
		});    
	});
	
	// bind filter button click
	jQuery('#portfolio-filter a').on( 'click', function(e) {
		e.preventDefault();
		if(jQuery(this).hasClass('disabled')) {return false;}
		var filterValue = jQuery(this ).attr('data-filter');
		$container_portfolio.isotope({ filter: filterValue });
		jQuery(this).parents('ul').find('li').removeClass('active');jQuery(this).parent('li').addClass('active');
		return false;
	});	
}

/**
* Popup window launcher
*
* @url - Url address for the popup window
* @title - Popup window title
* @w - Width of the window
* @h - Height of the window
*/
function ozyPopupWindow(url, title, w, h) {
	"use strict";
	var left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

/**
* To check iOS devices and versions
*/
function ozyCheckIsMobile() {
	"use strict";
	return (/Mobi/.test(navigator.userAgent));
}

function ozyCheckMac(){
	"use strict";
	var isMac = /(mac)/.exec( window.navigator.userAgent.toLowerCase() );
	return ( isMac != null && isMac.length );
}

/**
* ozy_full_row_fix
* 
* Set sections to document height which matches with selector
*/
function ozy_full_row_fix() {
	"use strict";
	if(jQuery('body.page-template-page-masterslider-full').length) { ozy_full_row_fix_calc('height'); }
}

function ozy_full_row_fix_calc(height_param) {
	"use strict";
	var header_height = jQuery('#header').height();
	var window_height = (jQuery(window).innerHeight() - ((jQuery(this).outerHeight(true) - jQuery(this).height())));
	if(jQuery('#wpadminbar').length>0) {header_height = header_height + jQuery('#wpadminbar').height();}		
	jQuery('#main').css(height_param, (window_height - header_height) + 'px' );	
}

function ozy_share_button() {
	"use strict";
	jQuery(document).on('click', 'body.single .post-submeta>a:not(.blog-like-link)', function(e) {
		e.preventDefault();
		ozyPopupWindow(jQuery(this).attr('href'), 'Share', 640, 440);		
	});	
}

/**
* ozy_hash_scroll_fix
*
* Check if there is a hash and scrolls to there, onload
*/
function ozy_hash_scroll_fix() {
	"use strict";
	setTimeout(function(){
	if(window.location.hash) {
		var hash = window.location.hash;
		if(jQuery(hash).length) {
			jQuery('html,body').animate({scrollTop: jQuery(hash).offset().top}, 1600, 'easeInOutExpo');
		}
	}}, 200);	
}

var ozy_ticker_containerheight = 0, ozy_ticker_numbercount = 0, ozy_ticker_liheight, ozy_ticker_index = 1, ozy_ticker_timer;
function ozy_callticker() {
	"use strict";
	jQuery(".ozy-ticker ul").stop().animate({
		"margin-top": (-1) * (ozy_ticker_liheight * ozy_ticker_index)
	}, 1500);
	jQuery('#ozy-tickerwrapper .pagination>a').removeClass('active');jQuery('#ozy-tickerwrapper .pagination>a[data-slide="'+ (ozy_ticker_index) +'"]').addClass('active');//bullet active
	if (ozy_ticker_index != ozy_ticker_numbercount - 1) {
		ozy_ticker_index = ozy_ticker_index + 1;
	}else{
		ozy_ticker_index = 0;
	}
	ozy_ticker_timer = setTimeout("ozy_callticker()", 3600);
}

/* Resets windows scroll position if there is a hash to make it work smooth scroll*/
var windowScrollTop = jQuery(window).scrollTop();
window.scrollTo(0, 0);
setTimeout(function() {
	"use strict";
	window.scrollTo(0, windowScrollTop);
}, 1);

jQuery(window).resize(function() {
	"use strict";
	ozy_full_row_fix();
});

jQuery(window).load(function(){
	if (jQuery().masonry) {
		/* Search page */
		if(jQuery('body.search-results').length) {
			jQuery('body.search-results .post-content>div').imagesLoaded( function(){				
				jQuery('body.search-results .post-content>div').masonry({
					itemSelector : 'article.result',
					gutter : 20
				});
			});
		}
	}	
});

jQuery(document).ajaxComplete(function() {
	/*re init lighgallery for newly loaded items*/
	if(jQuery('.wpb_wrapper.isotope').length) {
		var $target_gallery = jQuery('.wpb_wrapper.isotope');
		if($target_gallery.data('lightGallery')) {
			$target_gallery.data('lightGallery').destroy(true);
		}
		$target_gallery.lightGallery({
			selector: '.lightgallery',
			thumbnail:true
		});
	}
	
	/*Visual Composer Masonry Media Grid Lightbox Replacement with Photo Swipe*/
	if(jQuery('div.vc_masonry_media_grid').length || jQuery('div.vc_grid').length) {	
		$target_gallery = jQuery('div.vc_masonry_media_grid,div.vc_grid');
		if($target_gallery.data('lightGallery')) { $target_gallery.data('lightGallery').destroy(true); }     
		var items = [];
		jQuery('div.vc_gitem-zone-b>a.vc-photoswipe-link').each(function() {
			var $href = jQuery(this).attr('href');
			var item = {
				src : jQuery(this).attr('href'),
				thumb : jQuery(this).data('thumb'),
				'subHtml': (jQuery(this).attr('title') ? '<h4>' + jQuery(this).attr('title') + '</h4>' : '')
			};
			items.push(item);
		});
		if(items.length>0) {
			$target_gallery.lightGallery({
				thumbnail:true,
				dynamic: true,
				dynamicEl: items
			});
		}
	}
});

if(jQuery('.wpb_row[data-alternate_logo="1"]').length) {
	jQuery(window).scroll(function() {
		"use strict";
		jQuery.doTimeout('scroll', 100, function(){			
			var scrollTop = jQuery(this).scrollTop();
			var anyRowVisible = false;
			jQuery('.wpb_row[data-alternate_logo="1"]').each(function() {
				var topDistance = jQuery(this).offset().top;
				var topHeight = jQuery(this).outerHeight();
				if ((topDistance-100) < scrollTop && (topHeight+topDistance)>scrollTop+100) {					
					anyRowVisible = true;
					if(jQuery('#logo-default').css('opacity') == '1') {
						jQuery('body').addClass('ozy-logo-alternate');
					}
				}
			});
			
			if(!anyRowVisible) {
				if(jQuery('#logo-alternate').css('opacity') == '1') {
					jQuery('body').removeClass('ozy-logo-alternate');
				}
			}			
		});
	});
}

jQuery(document).ready(function($) {
	"use strict";
	
	jQuery(window).scroll(); //init logo switch for first time
	
	ozy_share_button();

	ozy_full_row_fix();
	
	ozy_ajax_load_more_blog_action();
	
	ozy_hash_scroll_fix();
	
	//ozy_check_back_to_top();

	/* Show primary menu when burger button clicked */
	$('.primary-menu-bar-wrapper button').on('click', function(){
		$('body').toggleClass('open');
	});	

	/* First close all menu items on initialization */
	$('.primary-menu-bar-wrapper .menu li a').each(function() {
		$(this).parent().children('ul:first').slideToggle();
    });

	/* Create custom css for menu animation */
	var custom_css_for_menu_items = '', custom_css_for_menu_item_delay = .75 ,custom_css_for_menu_item_counter = 1;
	$('.primary-menu-bar-wrapper .menu>li').each(function(index, element) {
		custom_css_for_menu_items += 'body.open .primary-menu-bar-wrapper ul.menu li:nth-child('+ custom_css_for_menu_item_counter +') {-webkit-transition-delay: '+ custom_css_for_menu_item_delay.toFixed(2) +'s;transition-delay: '+ custom_css_for_menu_item_delay.toFixed(2) +'s;}';
		custom_css_for_menu_item_counter++;
		custom_css_for_menu_item_delay = custom_css_for_menu_item_delay + .10;
    });
	$('<style type="text/css">'+ custom_css_for_menu_items +'</style>').appendTo('head');	
	
	/* Menu Item Handler */
	$('.primary-menu-bar-wrapper .menu li a').click(function (e) {		
		if($(this).parent('li').hasClass('dropdown')) {	
			e.preventDefault();					
			var $that = $(this).parent('li');
			$('.primary-menu-bar-wrapper .menu li').each(function() { if(!$that.is($(this))) { $(this).removeClass('open'); }});
			var ullist = $(this).parent().toggleClass('open').children('ul:first');
			ullist.slideToggle();
			$(this).parent().siblings().children().next().slideUp();
		}else{
			if (/#/.test(this.href)) {		
				e.preventDefault();
				if(ozy_headerType.$OZY_WP_IS_HOME != 'false') {
					ozy_click_hash_check(this);					
				}else{
					if(ozy_Animsition.is_active) {
						$('.animsition').animsition('out', $(e.target), ozy_headerType.$OZY_WP_HOME_URL + $(this).attr('href'));
					}else{
						window.location = ozy_headerType.$OZY_WP_HOME_URL + $(this).attr('href');
					}
				}
			}else{
				if(ozy_Animsition.is_active) {
					e.preventDefault();
					$('.animsition').animsition('out', $(e.target), $(this).attr('href'));
				}
			}
			$('body').toggleClass('open');
		}
	});

	/* Content Button Smooth Scroll Handler */	
	//if(ozy_headerType.$OZY_WP_IS_HOME) {
	$('#content a.vc_btn3[href*="#"], .widget ul.menu>li>a[href*="#"]').click(function(e) {
		/*e.preventDefault();
		ozy_click_hash_check(this);*/
		var pattern = /^((http|https|ftp):\/\/)/;
		if(pattern.test(this.href)) {
			e.preventDefault();
			if(ozy_headerType.$OZY_WP_IS_HOME != 'false') {
				ozy_click_hash_check(this);					
			}else{
				if(ozy_Animsition.is_active) {
					$('.animsition').animsition('out', $(e.target), $(this).attr('href'));
				}else{
					window.location = $(this).attr('href');
				}
			}				
		}else if (/#/.test(this.href)) {		
			e.preventDefault();
			if(ozy_headerType.$OZY_WP_IS_HOME != 'false') {
				ozy_click_hash_check(this);					
			}else{
				if(ozy_Animsition.is_active) {
					$('.animsition').animsition('out', $(e.target), ozy_headerType.$OZY_WP_HOME_URL + $(this).attr('href'));
				}else{
					window.location = ozy_headerType.$OZY_WP_HOME_URL + $(this).attr('href');
				}
			}
		}else{
			if(ozy_Animsition.is_active) {
				e.preventDefault();
				$('.animsition').animsition('out', $(e.target), $(this).attr('href'));
			}
		}
	});				
	//}

	/* Smooth Scroll */
	if(ozy_headerType.smooth_scroll) {
		if(!ozyCheckIsMobile() || ozyCheckMac()) { jQuery.scrollSpeed(100, 800); }
	}

	/* Animsition */
	if(ozy_Animsition.is_active) {
		$(".animsition").animsition({
			inClass: 'fade-in',
			outClass: 'fade-out',
			inDuration: 1500,
			outDuration: 800,
			linkElement: '#top-menu li>a:not([target="_blank"]):not([href^="#"])',
			// e.g. linkElement: 'a:not([target="_blank"]):not([href^=#])'
			loading: true,
			loadingParentElement: 'body', //animsition wrapper element
			loadingClass: 'animsition-loading',
			loadingInner: '', // e.g '<img src="loading.svg" />'
			timeout: false,
			timeoutCountdown: 5000,
			onLoadEvent: true,
			browser: [ 'animation-duration', '-webkit-animation-duration'],
			overlay : false,
			overlayClass : 'animsition-overlay-slide',
			overlayParentElement : 'body',
			transition: function(url){ window.location.href = url; }
		});
	}	
	
	/* Search Button & Stuff */
	var main_margin_top = $('#main').css('margin-top');
	$(document).on('touchstart, click', '#ozy-close-search,.menu-item-search>a', function(e) {
		if($('#top-search').hasClass('open')){
			$('#top-search').removeClass('open').delay(200);
			$('#top-search').animate({height:'0px'}, 200, 'easeInOutExpo');
			$('#info-bar,.logo-bar-wrapper').animate({opacity:1}, 400, 'easeInOutExpo');
		}else{
			$('html,body').animate({
				 scrollTop: 0
			}, 100, 'easeInOutExpo', function(){				
				$('#top-search').animate({height:'90px', opacity:1}, 200, 'easeInOutExpo',function(){$('#top-search>form>input').focus();$('#top-search').addClass('open');});
				$('#info-bar,.logo-bar-wrapper').animate({opacity:0}, 400, 'easeInOutExpo');
			});
			
		}
		e.preventDefault();
	});
	
	/* Close search box when clicked somewhere on the document, if opened already */
	$(document).on("touchstart, click", function(e) {
		if(ozyCheckIsMobile()) {
			var searchbox_div = $("#top-search");
			if (!searchbox_div.is(e.target) && !searchbox_div.has(e.target).length) {
				if($(searchbox_div).hasClass('open')){				
					$(searchbox_div).removeClass('open').delay(200);
					$(searchbox_div).animate({height:'0px'}, 200, 'easeInOutExpo');
					$('#info-bar,.logo-bar-wrapper').animate({opacity:1}, 400, 'easeInOutExpo');
				}
			}
		}
	});	

	function ozy_visual_stuff() {	
		/* Blog Share Button*/
		$(document).on('click', '.post-submeta>a.post-share, .big-blog-post-submeta>a.post-share', function(e) {
			if($(this).data('open') !== '1') {
				$(this).data('open', '1').next('div').stop().animate({'margin-left': '0', opacity: 'show'}, 300, 'easeInOutExpo');
			}else{
				$(this).data('open', '0').next('div').stop().animate({'margin-left': '30px', opacity: 'hide'}, 300, 'easeInOutExpo');
			}
			e.preventDefault();
		});
		$(document).on("click", function(e) {
			var post_share_button = $(".post-submeta>a.post-share, .big-blog-post-submeta>a.post-share");
			if (!post_share_button.is(e.target) && !post_share_button.has(e.target).length) {
				post_share_button.data('open', '0').next('div').stop().animate({'margin-left': '30px', opacity: 'hide'}, 300, 'easeInOutExpo');
			}
		});
		
		/* Tooltip plugin init */	
		$(function(){
			$('.tooltip-top').tooltipsy({className:'tooltipsy white', offset: [0, 20]});
			$('.tooltip').tooltipsy();
		});
	}
	
	ozy_visual_stuff();
	
	function ozy_vc_components() {
		/* Owl Carousel */
		$('.ozy-owlcarousel').each(function() {
			var $owl = $(this);
			$owl.owlCarousel({
				lazyLoad : true,
				autoPlay: $(this).data('autoplay'),
				items : $(this).data('items'),
				singleItem : $(this).data('singleitem'),
				slideSpeed : $(this).data('slidespeed'),
				autoHeight : $(this).data('autoheight'),
				//paginationSpeed: $(this).data('autoheight'),
				itemsDesktop : [1199,3],
				itemsDesktopSmall : [979,3],
				addClassActive: true,
				navigation: ($owl.hasClass('single') ? true : false),
				navigationText : ($owl.hasClass('single') ? ['<i class="oic-left-open-mini"></i>','<i class="oic-right-open-mini"></i>'] : false),
				afterInit:function(elem){
					owlCreateBar(this);
					setTimeout(function(){ $owl.find('.owl-item>.item').css({'width': '', 'height': ''}); }, 3000);
					$(elem).find('div.item').animate({opacity:1}, 600, 'easeInOutExpo');
				},
				afterLazyLoad: function() {
					
				},
				afterUpdate:function(elem){
					owlCreateBar(this);
					owlMoveBar(this, elem);
					$(window).trigger('resize');
				},
				afterMove:function(elem){
					owlMoveBar(this, elem);				
				}				
			});
		});
		function owlAfterAction() {}
		function owlCreateBar(owl){
			var owlPagination = owl.owlControls.find('.owl-pagination');
			owlPagination.append( "<span class='progressbar'></span>" );
	  	}	  
	  	function owlMoveBar(owl, elem){
			var owlPagination = owl.owlControls.find('.owl-pagination');
			var ProgressBar = owlPagination.find('.progressbar');
			var currentIndex = owlPagination.find($('.active')).index(); 
			var totalSlide = $(elem).find($('.owl-item')).length;
			ProgressBar.css({width: ( currentIndex * 100 / (totalSlide-1) ) + '%' });
	  	}

		/* Icon Shadow */
		$('.title-with-icon-wrapper>div>span[data-color],.ozy-icon[data-color]').flatshadow({angle: "SE", fade: false, boxShadow: false });
				
		/* Google Map */
		if ('undefined' !== typeof jQuery.fn.prettyMaps) {
			$('.ozy-google-map:not(.init-later)').each(function(index, element) {
				$(this).parent().append(
					$('<div class="gmaps-cover"></div>').click(function(){ $(this).remove(); })
				);
				$(this).prettyMaps({
					address: $(this).data('address'),
					zoom: $(this).data('zoom'),
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: true,
					streetViewControl: true,
					overviewMapControl: true,
					scrollwheel: true,
					image: $(this).data('icon'),
					hue: $(this).data('hue'),
					saturation: $(this).data('saturation'),
					lightness: $(this).data('lightness')
				});
			});
		}

		/* Counter */
		if ('undefined' !== typeof jQuery.fn.waypoint) {
			jQuery('.ozy-counter>.timer').waypoint(function() {
				if(!$(this).hasClass('ran')) {
					$(this).addClass('ran').countTo({
						from: $(this).data('from'),
						to: $(this).data('to'),
						speed: 5000,
						refreshInterval: 25,
						sign: $(this).data('sign'),
						signpos: $(this).data('signpos')
					});
				}
			},{ 
				offset: '85%'
			});
		}
		
		/* Typewriter */
		$(".typing-box").each(function() {
			var options = {
				typeSpeed : $(this).data('typespeed'),
				startDelay : $(this).data('startdelay'),
				backSpeed : $(this).data('backspeed'),
				backDelay : $(this).data('backdelay'),
				loop : $(this).data('loop'),
				strings : $.parseJSON(ozyTypeWriterData[$(this).data('path')])
			};
			$(this).typed(options);            
        });
		
		/* Instagram Feed */
		$('.ozy-instagram-gallery').each(function(index, element) {            
			var clientid = $(this).data('clientid'),
				   username = $(this).data('username'),
				   num_photos = $(this).data('numitems');
			
			$.ajax({
				url: 'https://api.instagram.com/v1/users/search',
				dataType: 'jsonp',
				type: 'GET',
				data: {client_id: clientid, q: username},
				success: function(data){
					$.ajax({
						url: 'https://api.instagram.com/v1/users/' + data.data[0].id + '/media/recent',
						dataType: 'jsonp',
						type: 'GET',
						data: {client_id: clientid, count: num_photos},
						success: function(data2){
							for(var i = 0; i < data2.data.length; i++) {
								$(element).append('<li><a href="'+ data2.data[i].link +'" title="'+ data2.data[i].caption.text +'" target="_blank"><img src="'+data2.data[i].images.thumbnail.url+'"></a></li>');  
							}
						},
						error: function(data2){
							$(element).append('<li>'+ data2 +'</li>');
						}
					});
				},
				error: function(data){
					$(element).append('<li>'+ data +'</li>');
				}
			});
		});
	}
	
	ozy_vc_components();
	
	/* page-portfolio.php*/
	if($('body.page-template-page-portfolio-php').length>0) {
		$('.wpb_wrapper.isotope').lightGallery({
			selector: '.lightgallery',
			thumbnail:true
		}); 
		
		ozy_page_template_page_portfolio_init();
	}	
		
	/* Contact Form 7 Date Time Picker */
	if ('undefined' !== typeof jQuery.fn.datetimepicker) {
		$('input.datetimepicker').datetimepicker();
	}

	function ozy_click_hash_check($this) {
		if (location.pathname.replace(/^\//,'') == $this.pathname.replace(/^\//,'') 
			|| location.hostname == $this.hostname) {
	
			var target = $($this.hash);
			target = target.length ? target : $('[name=' + $this.hash.slice(1) +']');
		   	if (target.length) {
				$('html,body').animate({
					 scrollTop: target.offset().top
				}, 1600, 'easeInOutExpo');
				return false;
			}
		}
	}
	
	/* Waypoint animations */
	if ('undefined' !== typeof jQuery.fn.waypoint) {
	    jQuery('.ozy-waypoint-animate').waypoint(function() {
			jQuery(this).addClass('ozy-start-animation');
		},{ 
			offset: '85%'
		});
	}
	
	/* Blog post like function */
	$(document).on('click', '.blog-like-link', function(e) {
		ajax_favorite_like($(this).data('post_id'), 'like', 'blog', this);
		e.preventDefault();
    });
	
	/* FancyBox initialization */
	$(".wp-caption>p").click(  function(){ jQuery(this).prev('a').attr('title', jQuery(this).text()).click(); } ); //WordPress captioned image fix
	$(".fancybox, .wp-caption>a, .single-image-fancybox a").fancybox({
		beforeLoad: function() {
		},
		padding : 0,
		helpers		: {
			title	: { type : 'inside' },
			buttons	: {}
		}
	});
	$('.fancybox-media').fancybox({openEffect  : 'none',closeEffect : 'none',helpers : {title	: { type : 'inside' }, media : {}}});
	
	/* Back to top button */	
	$('#back-to-top-wrapper').click(function(e) {
		e.preventDefault();
		$('body,html').animate({scrollTop:0},800);
	});
});