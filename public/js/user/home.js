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
    slidesPerView: 6,
    spaceBetween: 20,
    slidesPerGroup: 1,
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

var swiper = new Swiper(".productSwiper", {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 1,
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
        430: {
            slidesPerView: 2,
            spaceBetween: 5,
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

document.addEventListener("DOMContentLoaded", function(){
    var myOffcanvas = document.getElementById('homeOffCanvas');
    var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
    document.getElementById("navbar-toggler").addEventListener('click',function (e){
      e.preventDefault();
      e.stopPropagation();
      bsOffcanvas.toggle();
    });
  });

function wishlist(element, sellerID, productID, variantID, size) {
    if ($("#hidLogin").val()) {
        if (!element.classList.contains('i-red'))
            $.ajax({
                url: "/wishlist/add-product",
                type: "POST",
                data: {
                    sellerID: sellerID,
                    productID: productID,
                    variantID: variantID,
                    size: size,
                },
                dataType: 'json',
                success: function (result) {
                    if (result.status)
                        element.classList.add('i-red')
                }
            })
        else
            $.ajax({
                url: "/wishlist/remove-product",
                type: "POST",
                data: {
                    sellerID: sellerID,
                    productID: productID,
                    variantID: variantID,
                    size: size,
                },
                dataType: 'json',
                success: function (result) {
                    if (result.status)
                        element.classList.remove('i-red');
                }
            })
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

$("#navbar-menu").on("shown.bs.collapse", function () {
    $(".dropdown-menu").css({ "position": "absolute", "left": "50%" })
});

$("#navbar-menu").on("hidden.bs.collapse", function () {
    $(".dropdown-menu").css({ "position": "absolute", "left": "auto" })
});