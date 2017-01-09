/**
 * Created by Marta on 08/01/2017.
 */

var dropdown = document.getElementsByClassName("dropdown")[0];
var ul = dropdown.querySelector("ul");

dropdown.addEventListener("click", function(e) {
    var style = ul.style.display;
    console.log(style);

    if(style == "block") {
        ul.style.display = "none";
    } else {
        ul.style.display = "block";
    }
});