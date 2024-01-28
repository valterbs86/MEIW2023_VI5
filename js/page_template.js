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
		
		targetDiv.scrollIntoView({ behavior: 'smooth' });
		
}
