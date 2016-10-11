jQuery(document).ready(function($){
	//open popup
	$('.employ_detail').on('click', function(event){
		event.preventDefault();
		$('#employ_detail').addClass('is-visible');
	});
	$('.security_property').on('click', function(event){
		event.preventDefault();
		$('#security_property').addClass('is-visible');
	});
	$('.liability_details').on('click', function(event){
		event.preventDefault();
		$('#liability_details').addClass('is-visible');
	});
	$('.application_summary').on('click', function(event){
		event.preventDefault();
		$('#application_summary').addClass('is-visible');
	});
	
	//close popup
	$('.cd-popup').on('click', function(event){
		if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$('.cd-popup').removeClass('is-visible');
	    }
    });
});