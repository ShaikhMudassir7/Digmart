// var swiper = new Swiper(".navSwiper", {
//     slidesPerView: 5,
//     spaceBetween: 20,
//     slidesPerGroup: 1,
//     fade: 'true',
//     keyboard: {
//         enabled: true,
//     },
//     navigation: {
//         nextEl: "#navLeft",
//         prevEl: "#navRight",
//     },

//     breakpoints: {
//         0: {
//             slidesPerView: 1,
//         },
//         450: {
//             slidesPerView: 2,
//             spaceBetween: 10,
//         },
//         730: {
//             slidesPerView: 3,
//         },
//         992: {
//             slidesPerView: 4,
//         },
//         1175: {
//             slidesPerView: 5,
//         },
//     },
// });

$(document).ready(function () {
    var navID = $('#firstnav').val()
    var tabID = $('#firsttab').val()
    $(navID).attr('aria-selected', true);
    $(navID).addClass("active");
    $(tabID).addClass("active show");
    var el = document.getElementById('nav-tab')
    if (el.scrollWidth > el.clientWidth) {
        $('#navLeft').css('display', 'block')
        $('#navRight').css('display', 'block')
    }
})

var tabs = document.getElementById('nav-tab')
$("#navLeft").on("click", function () {
    tabs.scrollLeft -= 50
})

$("#navRight").on("click", function () {
    tabs.scrollLeft += 50
})

function wishlist(element) {
    element.classList.toggle('i-red');
}

function catChange(val) {
    alert('Only show products which belong to Sub-category: - ' + val)
}