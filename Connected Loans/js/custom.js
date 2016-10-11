/* requestAnimationFrame crossbrowser support */
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

/* wp fade plugin */
function wp_fade($link, $target, additional){
	var $window = $(window),
		window_width = $window.width(),
		window_height = $window.height(),
		current_window_width = 0,
		settings = global_DOM_cache.settings;
	
	var $body = settings.body;
		
	settings.wp_fade_current = [],
	settings.wp_fade_timeout = '';
	
	var $fade = $('#wp_fade');
	if($fade.data('init') != true){
		$fade
			.on('click', function(){
				methods.hide(true);
				return false;
			})
			.data('init', true);
	}
	
	if(typeof $target == 'string'){
		$target = $($target);
	}
	
	var methods = {
		init : function(){
			if(typeof $link == 'string'){
				$link = $($link);
			}
			if($link[0]){
				$link.on('click', function(){
					methods.show();
					return false;
				});
			}
		},
		
		show : function(){
			settings.wp_fade_current = $target;
			if(!$target.hasClass('show')){
				if(additional){
					$target.data('target', additional);
				}
				methods.update();
				methods.toggle();
				setTimeout(function(){
					$target.addClass('show');
					if(!$fade.hasClass('show')){
						$fade.addClass('show');
					}
				},10);
			}
			
			var $close_btn = $target.find('.popup_close');
			if($close_btn.data('init') != true){
				$close_btn
					.on('click', function(){
						methods.hide($target);
						return false;
					})
					.data('init', true);
			}
			
		},
		
		
		hide : function(global){
			clearTimeout(settings.wp_fade_timeout);
			if(global){
				$target = $body.find('.popup.show');
			}
			
			if($target.hasClass('video_container')){
				$target.find('video').get(0).pause();
			}
			
			$target
				.removeClass('show');
			
			$fade.removeClass('show');
			settings.wp_fade_timeout = setTimeout(function(){ methods.toggle('hide'); }, 300);
		},
		
		toggle : function(state){
			if(state == 'hide'){
				$target.css('display', 'none');
				$fade.css('display', 'none');
			}
			else{
				$target.css('display', 'block');
				$fade.css('display', 'block');
			}
		},
		
		/* update on screen resize */
		update : function(){
			var target_height = $target.height();
			if(target_height > window_height){
				$target.css({
					'top' : $window.scrollTop()
				});
			}
			else{
				$target.css({
					'top' : $window.scrollTop() + Math.round((window_height - target_height) / 2)
				});
			}
		},
		
	};
	
	if($link && $target){
		if($link == 'show'){
			
			methods.show();
		}
		else if($link == 'hide'){
			if($target){
				methods.hide();
			}
			else{
				methods.hide(true);
			}
		}
		else{
			methods.init();
		}
	}
}

$(document).ready(function() {
	window.global_DOM_cache = {};
	var $body = $(document.body);
	
	var settings = {
		'body' 		: $body,
	};
	
	global_DOM_cache.settings = settings;
	
	var methods = {
		
		/* INIT */
		init : function(){
			var $active_elements = $('.tab-selector, .tab-content h3 .form-control-wrap, .select-control, .radio-control, .boolean-control, .popup, button.browse-more, #browse_more_lenders, .limit4');
			
			// tab
			var $tab_selector =  $active_elements.filter('.tab-selector');
			if($tab_selector[0]){
				$tab_selector
					.on('click', function(){
						methods.tab_selector_click($(this));
						return false;
					})
					.first().trigger('click');
			}
			
			// tab h3 fix
			var $tab_h3_control = $active_elements.filter('.tab-content h3 .form-control-wrap');
			if($tab_h3_control[0]){
				for(var i = 0, iL = $tab_h3_control.length; i < iL; i++){
					$tab_h3_control.eq(i).closest('h3').addClass('has-control');
				}
			}
			
			// select control
			var $select_controls = $active_elements.filter('.select-control');
			if($select_controls[0]){
				methods.select_controls_init($select_controls);
			}
			
			// radio control
			var $radio_controls = $active_elements.filter('.radio-control');
			if($radio_controls[0]){
				methods.radio_controls_init($radio_controls);
			}
			
			// boolean control
			var $boolean_controls = $active_elements.filter('.boolean-control');
			if($boolean_controls[0]){
				methods.boolean_controls_init($boolean_controls);
			}
			
			// popups
			var $popups = $active_elements.filter('.popup');
			if($popups[0]){
				methods.popups_init($popups);
			}
			
			// show/hide results
			var $browse_more = $active_elements.filter('button.browse-more'),
				$browse_more_lenders = $active_elements.filter('#browse_more_lenders');
			if($browse_more[0] && $browse_more_lenders[0]){
				$browse_more.on('click', function(){
					if($browse_more_lenders.hasClass('hidden')){
						$browse_more_lenders.removeClass('hidden');
						$browse_more.html($browse_more.attr('data-less'));
					}
					else{
						$browse_more_lenders.addClass('hidden');
						$browse_more.html($browse_more.attr('data-more'));
					}	
					return false;
				});
			}
			
			var $limit4 = $active_elements.filter('.limit4');
			if($limit4[0]){
				$limit4
					.on('keyup change', function(){
						var $this = $(this);
						if($this.val().length > 4){
							$this.val($this.val().substring(0, 4));
						}
					})
			}
		},
		
		
		/* TAB */
		tab_selector_click : function($tab_selector){
			var $parent = $tab_selector.parent();
			if($parent.hasClass('active')){
				$parent
					.removeClass('active');
			}
			else{
				$parent
					.addClass('active')
					.siblings('.active')
						.removeClass('active');
			}
		},
		
		
		/* SELECT CONTROLS */
		select_controls_init : function($select_controls){
			var $current = $select = $options = $option = $selected = [],
				o = oL = 0;
			
			for(var i = 0, iL = $select_controls.length; i < iL; i++){
				$current = $select_controls.eq(i);
				$select = $current.find('select');
				$options = $select.find('option');
				$selected = $options.filter('[value="' + $select.val() + '"]').html();
				if(!$selected){
					$selected = '';
				}
				
				var html = '<div class="select-control-wrap"><a href="#" class="select-control-trigger">' +$selected + '</a><div class="select-control-options">';
				
				for(o = 0, oL = $options.length; o < oL; o++){
					$option = $options.eq(o);
					html += '<a href="#" data-value="' + $option.val() + '" class="select-control-option">' + $option.html() + '</a>';
				}
				html += '</div></div>';
				$current.append(html);
			}
			
			if($body.data('select-control-trigger-click') != true){
				$body
					.data('select-control-trigger-click', true)
					.on('click', '.select-control-trigger', function(){
						methods.select_controls_toggle($(this).closest('.select-control'));
						return false;
					});	
			}
			
			if($body.data('select-control-trigger-blur') != true){
				$body
					.data('select-control-trigger-blur', true)
					.on('blur', '.select-control-trigger', function(){
						var $this = $(this);
						requestAnimationFrame(function(){
							if(!$(document.activeElement).hasClass('select-control-option')){
								methods.select_controls_toggle($this.closest('.select-control'), 'close');
							}
						});
						return false;
					});
			}
			
			if($body.data('select-control-option-click') != true){
				$body
					.data('select-control-option-click', true)
					.on('click', '.select-control-option', function(){
						methods.select_controls_select($(this));
						return false;
					});
			}
		},
		
		/* - select open/close */
		select_controls_toggle : function($select_control, force_state){
			var $col = $select_control.parents('.col, .row'),
				action;
			
			// identify action
			if(force_state){
				action = force_state;
			}
			else{
				if($select_control.hasClass('opened')){
					action = 'close';
				}
				else{
					action = 'open';
				}
			}
			
			if(action === 'open'){
				$col.addClass('current');
				$select_control.addClass('opened');
			}
			else{
				$select_control.removeClass('opened');
				$col.removeClass('current');
			}
		},
		
		/* - select value select */
		select_controls_select : function($option){
			var $select_control = $option.closest('.select-control'),
				$select = $select_control.find('select'),
				$trigger = $select_control.find('.select-control-trigger');
			
			$select.val($option.attr('data-value'));
			$trigger.html($option.html());
			methods.select_controls_toggle($select_control, 'close');
		},
		
		
		/* RADIO CONTROLS */
		radio_controls_init : function($radio_controls){
			var $current = $radios = $radio = [],
				o = oL = 0,
				checked = '';
			
			for(var i = 0, iL = $radio_controls.length; i < iL; i++){
				$current = $radio_controls.eq(i);
				$radios = $current.find('input[type="radio"]');
				
				var html = '<div class="radio-control-wrap"><div class="radio-control-options">';
				for(o = 0, oL = $radios.length; o < oL; o++){
					$radio = $radios.eq(o);
					html += '<a href="#" data-value="' + $radio.val() + '" class="radio-control-option' + ($radio.get(0).checked ? ' checked' : '') + '">' + $radio.attr('data-title') + '</a>';
					if($radio.get(0).checked){
						var data_show = $radio.attr('data-show'),
							data_hide = $radio.attr('data-hide');
						
						if(data_show){
							data_show = data_show.split(',');
							for(var s = 0, sL = data_show.length; s < sL; s++){
								$(data_show[s].trim()).show();
							}
						}
						if(data_hide){
							data_hide = data_hide.split(',');
							for(var s = 0, sL = data_hide.length; s < sL; s++){
								$(data_hide[s].trim()).hide();
							}
						}
					}
				}
				html += '</div></div>';
				$current.append(html);
			}
			
			if($body.data('radio-control-option-click') != true){
				$body
					.data('radio-control-option-click', true)
					.on('click', '.radio-control-option', function(){
						methods.radio_controls_select($(this));
						return false;
					});
			}
		},
		
		/* - radio value select */
		radio_controls_select : function($option){
			var $radio_control = $option.closest('.radio-control'),
				$radio = $radio_control.find('input[type="radio"]').filter('[value="' + $option.attr('data-value') + '"]');
			
			$radio.get(0).checked = true;
			$option
				.addClass('checked')
				.siblings('.checked')
					.removeClass('checked');
			
			var data_show = $radio.attr('data-show'),
				data_hide = $radio.attr('data-hide');
				
			if(data_show){
				data_show = data_show.split(',');
				for(var s = 0, sL = data_show.length; s < sL; s++){
					$(data_show[s].trim()).show();
				}
			}
			if(data_hide){
				data_hide = data_hide.split(',');
				for(var s = 0, sL = data_hide.length; s < sL; s++){
					$(data_hide[s].trim()).hide();
				}
			}
			
		},
		
		
		/* BOOLEAN CONTROLS */
		boolean_controls_init : function($boolean_controls){
			var $current = $form_control = $boolean = [],
				o = oL = 0,
				checked = false;
			
			for(var i = 0, iL = $boolean_controls.length; i < iL; i++){
				$current = $boolean_controls.eq(i);
				$boolean = $current.find('input[type="checkbox"]');
				checked = $boolean.get(0).checked;
				
				if(checked){
					$current.closest('.form-control-wrap').addClass('checked');
				}
				
				var html = '<div class="boolean-control-wrap"><div class="boolean-control-options">';
				html += '<a href="#" data-value="true" class="boolean-control-option' + (checked ? ' checked' : '') + '">' + $boolean.attr('data-true') + '</a>';
				html += '<a href="#" data-value="false" class="boolean-control-option' + (checked ? '' : ' checked') + '">' + $boolean.attr('data-false') + '</a>';
				html += '</div></div>';
				$current.append(html);
			}
			
			if($body.data('boolean-control-option-click') != true){
				$body
					.data('boolean-control-option-click', true)
					.on('click', '.boolean-control-option', function(){
						methods.boolean_controls_select($(this));
						return false;
					});
			}
		},
		
		/* - boolean value select */
		boolean_controls_select : function($option){
			var $boolean_control = $option.closest('.boolean-control'),
				$form_control = $boolean_control.closest('.form-control-wrap'),
				$boolean = $boolean_control.find('input[type="checkbox"]');
			
			if($option.attr('data-value') === 'true'){
				$boolean.get(0).checked = true;
				$form_control.addClass('checked');
			}
			else{
				$boolean.get(0).checked = false;
				$form_control.removeClass('checked');
			}
			
			$option
				.addClass('checked')
				.siblings('.checked')
					.removeClass('checked');
		},
	
		
		/* POPUPS */
		popups_init : function($popups){
			var $popup = $form = [];
			for(var i = 0, iL = $popups.length; i < iL; i++){
				$popup = $popups.eq(i);
				$form = $popup.find('form');
				
				$form.on('submit', function(){
					methods.popups_submit($(this));
					return false;
				});
			}
		},
		
		/* - popup submit */
		popups_submit : function($form){
			var $popup = $form.closest('.popup'),
				$target = $($popup.data('target'));
			
			if($target[0]){
				// find all checked controls
				var $popup_control_wraps = $form.find('.form-control-wrap.checked');
				
				if($popup_control_wraps[0]){
					var $target_control_wraps = $target.find('.form-control-wrap'),
						$popup_control_wrap = $popup_input = [],
						$target_control_wrap = $target_input = [];
					
					// loop throught checked controls
					for(var i = 0, iL = $popup_control_wraps.length; i < iL; i++){
						$popup_control_wrap = $popup_control_wraps.eq(i);
						$popup_control_dependent = $popup_control_wrap.next();
						$popup_input = $popup_control_wrap.find('.input-control input');
						
						var $dep_clone = $popup_control_dependent.clone(true);
						$dep_clone.removeClass('form-control-wrap-wide');
						var $cols = $dep_clone.find('.col');
						if($cols.length != 3){
							$cols.attr('class', 'col col-xs-6 col-sm-6');
								
						}
						
						var $popup_control_clone = $popup_control_wrap.clone(true);
						if($popup.data('target') == '#calculator_second_borrower'){
							var $inputs = $popup_control_clone.find('input, select, textarea');
							$inputs.each(function(){
								var $this = $(this);
								$this.attr('name', 'second_' + $this.attr('name'));
							});
							
							var $dep_inputs = $dep_clone.find('input, select, textarea');
							$dep_inputs.each(function(){
								var $this = $(this);
								$this.attr('name', 'second_' + $this.attr('name'));
							});
						}
						
						
						
						// find out if there is already a field with that name in the target location
						$target_input = $target_control_wraps.find('input[name="' + $popup_input.attr('name') + '"]');
						
						// - it is already in the target location - replace current fields with new ones
						if($target_input[0]){
							$target_control_wrap = $target_input.closest('.form-control-wrap');
							$target_control_dependent = $target_control_wrap.next();
							$target_control_wrap.replaceWith($popup_control_clone);
							if($popup_control_dependent.hasClass('dependent') && $target_control_dependent.hasClass('dependent')){
								$target_control_dependent.replaceWith($dep_clone);
							}
						}
						// - it is not there, so just insert them
						else{
							$target.append($popup_control_clone);
							if($popup_control_dependent.hasClass('dependent')){
								$target.append($dep_clone);
							}
						}
					}
				}
			}
			
			wp_fade('hide', $popup);
		},
		
		
		
	};
	methods.init();
})