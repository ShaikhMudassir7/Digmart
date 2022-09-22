var swiper = new Swiper(".categorySwiper", {
    slidesPerView: 6,
    spaceBetween: 20,
    slidesPerGroup: 1,
    // loop: true,
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
        0: {
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
    if ($("#hidLogin").val()) {
        element.classList.toggle('i-red');
    } else {
        $('#loginpopup').modal('show');
    }
}

function cart() {
    if ($("#hidLogin").val()) {
        console.log("Added to Cart")
    } else {
        $('#loginpopup').modal('show');
    }
}

function getLocation() {
    if (navigator.geolocation) {
        if (!sessionStorage.pincode)
            navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else
        alert("Geolocation is not supported by this browser.")

}
getLocation();

function showPosition(position) {
    $.ajax({
        url: "/api/pincode",
        type: "POST",
        data: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
        },
        dataType: 'json',
        success: function (result) {
            if (result.pincode != 'error')
                sessionStorage.setItem("pincode", result.pincode);
        }
    });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            // window.location.reload()
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }
}
