/**
 * Created by Marta on 29/07/2016.
 */
function messageInfoHeight() {
    var div = $(".cp-messages-stats .message-wrap").outerHeight();
    var message = $(".cp-messages-stats .message-stat");

    message.css("height", div/3+5);
}

function datePicker() {
	$("#date-from, #date-to").datepicker();
}

function colorChange() {
	$("#cp-name, #cp-description, .timing input").on("input", function() {
		$("#cp-save").css("background", "#63d0ec");
	});

	$(".acc-first-name, .acc-last-name, .acc-password, .acc-role, .acc-email, .acc-state").on("input", function() {
		$("#cp-save").css("background", "#63d0ec");
	});

	$("#edit-tab .timing input").on("change", function() {
		$("#cp-save").css("background", "#63d0ec");
	});

	$("#cp-name").on("input", function() {
		$("#cp-create").css("background", "#63d0ec");

		if(!$("#cp-name").val()) {
			$("#cp-create").css("background", "#989798");
		}
	});
}

$(document).ready(function() {
   messageInfoHeight();
   datePicker();
   colorChange();
});

$(window).resize(function() {
    messageInfoHeight();
});