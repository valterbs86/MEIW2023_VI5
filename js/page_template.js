window.onscroll = function() {slideMenu()};

var header = document.getElementById("myMenu");
var sticky = header.offsetTop;


function slideMenu() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function scrollToDiv(div) {
    let text1 = ".";
    let element = text1.concat(div);
    var targetDiv = document.querySelector(element);
    
    // Calculate the offset to scroll above the target div
    var scrollPosition = targetDiv.offsetTop - 50;

    // Scroll to the calculated position
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

$(function() {
  $("#include_methodology").load("methodology.html");
});

$(function() {
  $("#include_menu").load("menu.html");
});
