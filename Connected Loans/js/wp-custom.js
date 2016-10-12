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
				//methods.update();
				methods.toggle();
				
				setTimeout(function(){
					$fade
						.addClass('show');
					setTimeout(function() {
						$target
							.addClass('show');
					}, 250);
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
			$target.removeClass('show');
			
			setTimeout(function() {
				$fade.removeClass('show')
			}, 550);
						
			settings.wp_fade_timeout = setTimeout(function(){ methods.toggle('hide'); }, 750);
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

$(document).ready(function($){
	var $window = $(window),
		window_width = window.innerWidth,
		window_height = $window.height(),
		update_functions = [],
		resize_timeout = '',
		current_window_width = 0,
		$scroll_header = $('#scroll-header');
	
	window.global_DOM_cache = {
		settings : {
			body : $('body'),
		}
	};
	
	
	var methods = {
		/* INIT */
		init : function(){
			var $load_sc = $('#load_sc'),
				$lender_res = $('#lender_res');
			
			if($lender_res[0]){
				
				// table
				methods.datatable_init($lender_res);
				
				// search
				methods.search_init($lender_res, $load_sc);
				
				// update on window resize
				$window.on('resize', function(){
					methods.screen_resize();
					return false;
				});
				
				$window.on('scroll.scroll_fix', function() {
					if(window_width < 980){
						if($scroll_header[0]){
							var scroll_top = $window.scrollTop();
							if ($scroll_header.offset().top < scroll_top) {
								$scroll_header.addClass('affix');
							} else {
								$scroll_header.removeClass('affix');
							}
						}
					}
					return false;
				});
				
			}
		},
		
		
		/* DATA TABLE FUNCTIONALITY */
		datatable_init : function($lender_res){
			$lender_res.find('#lenders').DataTable({
				"dom": '<"top">rt<"bottom"l><"clear">',
				"iDisplayLength": 20,
				"lengthMenu": [20, 50, 70, 100],
				"language": {
					"emptyTable": "Enter Your Loan Details to Start Your Search!"
				}
			});
		},
		
		
		/* SEARCH */
		search_init : function($lender_res, $load_sc){
			var $mobile_left_menu = $('#mobile_left_menu'),
				$filter_popup = $('#filter_popup'),
				$left_menu = $('#left_menu');
				
			if($left_menu[0]){
				
				// SORT
				var $mobile_sort = $mobile_left_menu.find('.mobile_sort'),
					$mobile_sort_button = $mobile_sort.find('#mobile-sort-button'),
					$mobile_sort_links = $mobile_sort.find('.dropdown_menu a');
					
				$mobile_sort_button.on('click', function(){
					var $parent = $(this).parent();
					if($parent.hasClass('opened')){
						$parent.removeClass('opened');
					}
					else{
						$parent.addClass('opened');
					}
					return false;
				});
				$mobile_sort_links.on('click', function(){
					var $this = $(this);
					methods.sort_data($this, $lender_res);
					$mobile_sort_button.parent().removeClass('opened');
					return false;
				});
				
				// FILTER
				var $mobile_filter = $mobile_left_menu.find('.mobile_filter'),
					$mobile_filter_button = $mobile_filter.find('#mobile-filter-button');
					
				$mobile_filter_button.on('click', function(){
					var $this = $(this);
					wp_fade('show', $filter_popup);
					return false;
				});
				
				// mobile slide
				var $slide_links = $left_menu.find('.slide_link'),
					$slide_tabs = $left_menu.find('.slide_tab'),
					$features_fixed_tab = $('#features_fixed_tab');
				
				$slide_links.on('click', function(){
					var $this = $(this);
					if($this.hasClass('active')){
						var $other = $slide_links.not($this);
						$other.addClass('active');
						$slide_tabs.filter('#' + $other.data('id'))
							.addClass('active')
							.stop()
							.slideDown(300);
						
						$this.removeClass('active');
						$slide_tabs.filter('#' + $this.data('id'))
							.removeClass('active')
							.stop()
							.slideUp(300);
						
						if($this.attr('data-id') === 'slide_tab_features'){
							$features_fixed_tab.addClass('fixed');
						}
						else{
							$features_fixed_tab.removeClass('fixed');
						}
						
					}
					else{
						var $other = $slide_links.not($this);
						$other.removeClass('active');
						$slide_tabs.filter('#' + $other.data('id'))
							.removeClass('active')
							.stop()
							.slideUp(300);
						
						$this.addClass('active');
						$slide_tabs.filter('#' + $this.data('id'))
							.addClass('active')
							.stop()
							.slideDown(300);
						
						if($this.attr('data-id') === 'slide_tab_features'){
							$features_fixed_tab.removeClass('fixed');
						}
						else{
							$features_fixed_tab.addClass('fixed');
						}
						
					}
					
					return false;
				});
				
				// search loan
				$left_menu.find(".search_loan").on('click', function(e) {
					var $this = $(this),
						loan_amount = parseInt($("#l_amount").val().replace(/,/g, '')),
						home_amount = parseInt($("#h_value").val().replace(/,/g, ''));
				
					if(loan_amount <= 0 || isNaN(loan_amount)) {
						alert("Loan amount required");
					} 
					else if(home_amount <= 0 || isNaN(home_amount)) {
						alert("Home amount required");
					}
					else if(loan_amount > home_amount) {
						alert("Loan amount can't be higher than Home value");
					}
					else{
						// hide popup (if it is opened)
						var $filter_popup = $this.closest('#filter_popup');
						if($filter_popup[0]){
							wp_fade('hide', $filter_popup);
						}
						
						// get data
						methods.grab_lenders($load_sc, $lender_res, $left_menu, loan_amount, home_amount);
					}
					return false;
				});
				
				// rate type
				var $r_type = $left_menu.find('.r_type'),
					$fixed_year = $left_menu.find('#fixed_year');
				
				$r_type.on('click', function() {
					var $this = $(this);
					$r_type.filter('.active').removeClass('active');
					
					if($this.html() == 'Fixed'){
						$fixed_year.show();
					}
					else{
						$fixed_year.hide();
					}
					$this.addClass("active");
					
					return false;
				});
				
				// fixed year checkboxes
				$fixed_year.find('input')
					.on('change', function(){
						var $li = $(this).closest('li');
						if(this.checked){
							$li.addClass('checked_cell');
						}
						else{
							$li.removeClass('checked_cell');
						}
						return false;
					})
					.each(function(){
						var $li = $(this).closest('li');
						if(this.checked){
							$li.addClass('checked_cell');
						}
						else{
							$li.removeClass('checked_cell');
						}
					});
				
				
				// occupancy
				var $iterm = $left_menu.find('.iterm');
				$iterm.on('click', function() {
					$iterm.filter('.active').removeClass('active');
					$(this).addClass("active");
					return false;
				});
				
				// purpose
				var $ipurpose = $left_menu.find('.ipurpose');
				$ipurpose.on('click', function(){
					$ipurpose.filter('.active').removeClass('active');
					$(this).addClass("active");
					return false;
				});
				
				var $input_money = $left_menu.find('input.money');
				$input_money.on('keyup change', function(event){
					// skip for arrow keys
					if (event.which >= 37 && event.which <= 40) return;
				
					// format number
					$(this).val(function(index, value) {
						return value
							.replace(/\D/g, "")
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					});
				});
				
				methods.search_update([$mobile_left_menu, $filter_popup, $left_menu, $lender_res]);
				update_functions[update_functions.length] = [methods.search_update, [$mobile_left_menu, $filter_popup, $left_menu, $lender_res]];
			}
		},
		
		/* - search update */
		search_update : function(params){
			var $mobile_left_menu = params[0],
				$filter_popup = params[1],
				$left_menu = params[2],
				$lender_res = params[3];
			
			if(window_width <= 980){
				if($mobile_left_menu.data('relocated') != true){
					// move left menu to popup
					$mobile_left_menu.data('relocated', true);
					$filter_popup.append($left_menu);
					
					// rebuild table
					methods.build_table($lender_res);
				}
			}
			else{
				if($mobile_left_menu.data('relocated') == true){
					// move popup back to panel
					$mobile_left_menu
						.data('relocated', false)
						.parent()
							.append($left_menu);
					
					// rebuild table
					methods.build_table($lender_res);
					
					// hide popup and fade (in case they were opened)
					wp_fade('hide', $filter_popup);
				}
			}
		},
		
		
		/* DATA POPULATION */
		grab_lenders : function($load_sc, $lender_res, $left_menu, loan_amount, home_amount){
			$load_sc.show();
			$lender_res.hide();

			var r_type = "",
				f_year = "",
				fa = $left_menu.find('.ipurpose.active').attr("data"),
				proPack = $left_menu.find('.proPack:checked').length,
				ltypes = "",
				lfeats = "",
				l_p = $left_menu.find('.iterm.active').attr("data");
			
			// rate type
			var $r_type = $left_menu.find('.r_type.active');
			r_type = $r_type.html();
			if(r_type == "Fixed"){
				$left_menu.find('.lyears:checked').each(function() {
					f_year = f_year + $(this).val() + ",";
				});
			}
			
			// types
			$left_menu.find('.ltypes:checked').each(function() {
				ltypes = ltypes + $(this).val() + ",";
			});
			
			// features
			$left_menu.find('.lfeats:checked').each(function() {
				lfeats = lfeats + $(this).val() + ",";
			});

			// AJAX call
			$.ajax({
				url: "api_call.php",
				method: "post",
				data: {
					lamount: loan_amount,
					hamount: home_amount,
					r_type: r_type,
					featuresAvailable: fa,
					f_year: f_year,
					proPack: proPack,
					lfeats: lfeats,
					ltypes: ltypes,
					l_p: l_p
				},
				success: function(res) {
					
					// set result data
					$lender_res.data('result', res);
					
					// parse data
					methods.parse_result_data($lender_res);
					
					
					$load_sc.hide();
					$lender_res.show();
				},
				error: function(e) {
					$lender_res
						.html("<div class='alert alert-danger'>Unexpected error occured. Try again.</div>")
						.show();
					$load_sc.hide();
				}
			});
		},
		
		/* - data parsing */
		parse_result_data : function($lender_res){
			var data = $lender_res.data('result'),
				$table = $(data);
			
			if(!$table.hasClass('alert')){
				var $theader_tds = $table.find('thead th'),
					$tbody_trs = $table.find('tbody tr'),
					$tbody_tr = $tbody_tds = [],
					current_data = {},
					t = tL = 0,
					header_data = cell_data = parsed_cell_data = '';
				
				
				var parsed_data = {
					'header'	: [$theader_tds.length],
					'body'		: [$tbody_trs.length]
				};
				
				// header
				for(var i = 0, iL = $theader_tds.length; i < iL; i++){
					parsed_data.header[i] = $theader_tds.eq(i).html();
				}
				
				// body
				for(var i = 0, iL = $tbody_trs.length; i < iL; i++){
					current_data = {};
					$tbody_tds = $tbody_trs.eq(i).find('td');
					
					for(t = 0, tL = $tbody_tds.length; t < tL; t++){
						cell_data = $tbody_tds.eq(t).html();
						header_data = parsed_data.header[t];
						current_data[header_data] = cell_data;
					}
					
					parsed_data.body[i] = current_data;
				}
				
				$lender_res.data('parsed_data', parsed_data);
			}
			
			// build table
			methods.build_table($lender_res);
		},
		
		/* - build table */
		build_table : function($lender_res){
			var data = $lender_res.data('result');
						
			// mobile view
			if(window_width <= 980){
				var parsed_data = $lender_res.data('parsed_data');
				if(parsed_data){
					var current_row = {},
						i = iL = t = 0,
						html = '<div class="lenders_wrap">';
					
					// build header
					html += '<div class="scroll-fix" id="scroll-header"><div class="scroll-fix-wrap"><div class="lenders_headers">';
					for(i = 2; i < 6; i++){
						html += '<div class="lenders_header">' +  parsed_data.header[i] + '</div>';
					}
					html += '</div></div></div>';
					
					// build rows
					html += '<div class="lenders_body">';
					
					for(i = 0, iL =  parsed_data.body.length; i < iL; i++){
						current_row = parsed_data.body[i];
						html += '<div class="lenders_row">';
						
						// numbers data
						html += '<div class="lenders_numbers">';
						for(t = 2; t < 6; t++){
							html += '<div class="lenders_number">' + current_row[parsed_data.header[t]] + '</div>';
						}
						html += '</div>';
						 
						// view more?
						//html += '<div class="lenders_viewmore"><a href="#">Home Start Loan Products : Click on this box & view comments for more information</a></div>';
						html += '<div class="lenders_viewmore"><a href="#">'+current_row[parsed_data.header[1]]+'</a></div>';
						// logo and buttons
						html += '<div class="lenders_footer">';
						html += '<div class="lenders_logo">' + current_row[parsed_data.header[0]] + '</div>';
						html += '<div class="lenders_buttons">' + current_row[parsed_data.header[6]] + '</div>';
						html += '<div class="clearfix"></div>';
						html += '</div>';
						
						
						html += '</div>'; // close row
					}
					html += '</div>'; //close body
					
					html += '<div class="lenders_showmore"><a href="#" id="mobile_show_more_button">Show more</a></div>';
					
					html += '</div>'; // close lenders_wrap
					
					// append the result
					$lender_res
						.empty()
						.append(html);
				}
				else{
					if(data){
						$lender_res
							.empty()
							.append($lender_res.data('result'));
					}
				}
				$scroll_header = $lender_res.find('#scroll-header');
			}
			
			// desktop view
			else{
				if(data){
					// insert table
					$lender_res
						.empty()
						.append($lender_res.data('result'));
					
					// fire dataTable plugin
					$lender_res.find('#lenders').DataTable({
						"dom": '<"top">rt<"bottom"l><"clear">',
						"iDisplayLength": 20,
						"lengthMenu": [20, 50, 70, 100],
						"order": [
							[2, "asc"]
						],
						"language": {
							"emptyTable": "Enter Your Loan Details to Start Your Search!"
						},
						"columnDefs": [{
							"orderable": false,
							"targets": 0
						}, {
							"orderable": false,
							"targets": 6
						}]
					});
				}
			}
		},
		
		/* - sort data */
		sort_data : function($this, $lender_res){
			var parsed_data = $lender_res.data('parsed_data');
			if(parsed_data){
				var data_type = $this.data('type'),
					index = -1;
				
				// identify sorted field index
				switch(data_type){
					case 'lender' : index = 0;
						break;
					case 'current_rate' : index = 2;
						break;
					case 'comparison_rate' : index = 3;
						break;
					case 'upfront_fee' : index = 4;
						break;
					case 'monthly_repayment' : index = 5;
						break;
					default : index = -1;
				}
				if(index > -1 && parsed_data.header.length >= index){
					console.log(index);
					console.log(parsed_data.header[index]);
					console.log('***');
					
					// sort body based on the field header index
					parsed_data.body = methods.sortBy(parsed_data.body, { prop: parsed_data.header[index]});
					
					// refresh stored data
					$lender_res.data('parsed_data', parsed_data);
					
					// rebuild table
					methods.build_table($lender_res);
				}
				else{
					alert('Unknown sort field!');
				}
			}
			else{
				alert('No data to sort');
			}
		},
		
		
		/* screen resize check */
		screen_resize : function(){
			clearTimeout(resize_timeout);
			resize_timeout = setTimeout(function(){
				current_window_width = window.innerWidth;
				if(current_window_width != window_width){
					window_width = current_window_width;
					window_height = $window.height();
					methods.update();
				}
			}, 300);
		},
		
		/* update on screen resize */
		update : function(){
			for(var i = 0, iL = update_functions.length; i < iL; i++){
				update_functions[i][0](update_functions[i][1]);
			}
		},
		
		
		
		/* sort object by property */
		sortBy : (function () {
			var _toString = Object.prototype.toString,
				_parser = function (x) { return x; },
				_getItem = function (x) {
					return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x);
				};

			// Creates a method for sorting the Array
			// @array: the Array of elements
			// @o.prop: property name (if it is an Array of objects)
			// @o.desc: determines whether the sort is descending
			// @o.parser: function to parse the items to expected type
			return function (array, o) {
				if (!(array instanceof Array) || !array.length)
					return [];
				if (_toString.call(o) !== "[object Object]")
					o = {};
				if (typeof o.parser !== "function")
					o.parser = _parser;
				o.desc = !!o.desc ? -1 : 1;
				return array.sort(function (a, b) {
					a = _getItem.call(o, a);
					b = _getItem.call(o, b);
					return o.desc * (a < b ? -1 : +(a > b));
				});
			};

		}()),
		
	};
	
	methods.init();
});