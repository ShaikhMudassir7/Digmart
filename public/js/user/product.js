const shareBtn = document.querySelector('.share-btn');
const shareOptions = document.querySelector('.share-options');
const sharelink = document.querySelector('.link-text');
sharelink.innerHTML = window.location.href
shareBtn.addEventListener('click', () => {
    shareOptions.classList.toggle('active');
})

function copyFunction() {
    console.log(sharelink.innerHTML)
    navigator.clipboard.writeText(sharelink.innerHTML);
    var copybtn = document.querySelector('.copy-btn');
    copybtn.innerHTML = "Copied"
}

function addwishlist(element,sellerID, productID, variantID) {
    if (document.getElementById("0size")) {
        var size = document.getElementById(count + 'size').innerText;
    } else {
        size = null;
    }

    $.ajax({
        url: "/wishlist/add-to-wishlist",
        type: "POST",
        data: {
            sellerID: sellerID,
            productID: productID,
            variantID: variantID,
            size: size,
        },
        dataType: 'json',
        success: function(result) {
            if (result.status) {
                if (result.status == 'login') {
                    $('#loginpopup').modal('show');
                } else {
                    element.classList.add('i-red');
                    swal({
                        title: "Product added to Wishlist",
                        icon: "success",
                    })
                }
            } else {
                swal({
                    title: "Product already in Wishlist",
                    icon: "info",
                })
            }
        }
    })
}


function addcart(sellerID, productID, variantID, colour) {
    if (document.getElementById("0size")) {
        var size = document.getElementById(count + 'size').innerText;
    } else {
        size = null;
    }

    $.ajax({
        url: "/cart/add-to-cart",
        type: "POST",
        data: {
            sellerID: sellerID,
            productID: productID,
            variantID: variantID,
            size: size,
            colour: colour,
        },
        dataType: 'json',
        success: function(result) {
            if (result.status) {
                if (result.status == 'login') {
                    $('#loginpopup').modal('show');
                } else {
                    swal('Success', 'Product added to Cart Successfully!', 'success')
                }
            } else {
                swal({
                    title: "Already in the Cart",
                    icon: "info",
                    type: "warning",
                })
            }
        }
    })
}


var swiper = new Swiper(".swiper", {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 1,
    fade: 'true',
    keyboard: {
        enabled: true,
    },
    navigation: {
        nextEl: "#nextProductBtn",
        prevEl: "#prevProductBtn",
    },
});

function check(productID) {
    $.ajax({
        url: "/review/checkprof",
        type: "POST",
        data: {
            productID: productID,
        },
        dataType: 'json',
        success: function(result) {
            if (result.status) {
                if (result.status == 'login') {
                    $('#loginpopup').modal('show');
                }
                else if(result.status == 'Reviewed'){
                    swal({
                        title: "You have already reviewd the Product",
                        icon: "info",
                        type: "warning",
                    })
                } 
                else if(result.status == 'noOrders'){
                    swal({
                        title: "Sorry! You have not ordered this product so You cant give your Feedback",
                        icon: "info",
                        type: "warning",
                    })
                }
                else {
                    $('#review-modal').modal('show');
                }
            } else {
                swal({
                    title: "Please complete your profile to Give a review",
                    icon: "info",
                    type: "warning",
                    showCancelButton: true,
                }, function() {
                    window.location = '/account';
                });
            }
        }
    })
}

function show(element){
    var hidden = document.getElementById("hidden-reviews");
    if(hidden.style.display == "none"){
        hidden.style.display = "inline"
        element.innerHTML="Hide Reviews"
    }else{
        hidden.style.display = "none"
        element.innerHTML="View All reviews"
    }
}