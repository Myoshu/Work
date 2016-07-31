/**
 * Created by Marta on 29/07/2016.
 */
function messageInfoHeight() {
    var div = $(".cp-messages-stats .message-wrap").outerHeight();
    var message = $(".cp-messages-stats .message-stat");

    message.css("height", div/3+5);
}

$(document).ready(function() {
   messageInfoHeight();
});

$(window).resize(function() {
    messageInfoHeight();
});