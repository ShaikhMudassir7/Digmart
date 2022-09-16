var swiper = new Swiper(".categorySwiper", {
    slidesPerView: 6,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loop: true,
    // loopFillGroupWithBlank: true,
    fade: 'true',
    keyboard: {
        enabled: true,
    },
    navigation: {
        nextEl: "#nextCategoryBtn",
        prevEl: "#prevCategoryBtn",
    },

    breakpoints: {
        0 :{
            slidesPerView: 1,
            spaceBetween: 10,
        },
        360: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        575: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        730: {
            slidesPerView: 4,
        },
        992: {
            slidesPerView: 5,
        },
        1175: {
            slidesPerView: 6,
        },
    },
});

var swiper = new Swiper(".sellerSwiper", {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    fade: 'true',
    keyboard: {
        enabled: true,
    },
    navigation: {
        nextEl: "#nextSellerBtn",
        prevEl: "#prevSellerBtn",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        450: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        730: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1175: {
            slidesPerView: 5,
        },
    },
});

var swiper = new Swiper(".productSwiper", {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    fade: 'true',
    keyboard: {
        enabled: true,
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    navigation: {
        nextEl: "#nextProductBtn",
        prevEl: "#prevProductBtn",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        450: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        730: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1175: {
            slidesPerView: 5,
        },
    },
});

function wishlist(element) {
    element.classList.toggle('i-red');
}

