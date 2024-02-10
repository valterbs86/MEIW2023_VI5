/*
Mestrado em Engenharia Informática e Tecnologia Web
Visualização de Informação
Projeto Final
Grupo: Claudia Pires (1303334) / Valter Bastos (2302612)
Ficheiro JS
*/

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
  $("#include_WorldOverView").load("WorldOverview.html");
});
