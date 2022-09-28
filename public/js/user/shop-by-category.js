$(document).ready(function () {
    var navID = $('#firstnav').val()
    var tabID = $('#firsttab').val()
    $(navID).attr('aria-selected', true);
    $(navID).addClass("active");
    $(tabID).addClass("active show");
    navScroll()
})

window.onresize = navScroll

function navScroll() {
    var el = document.getElementById('nav-tab')
    if (el.scrollWidth > el.clientWidth) {
        $('#navLeft').css('display', 'block')
        $('#navRight').css('display', 'block')
    } else {
        $('#navLeft').css('display', 'none')
        $('#navRight').css('display', 'none')
    }
    $("#navLeft").on("click", function () {
        el.scrollLeft -= 50
    })

    $("#navRight").on("click", function () {
        el.scrollLeft += 50
    })
}

function wishlist(element, userID, sellerID, productID, variantID, size) {
    if ($("#hidLogin").val()) {
        if (!element.classList.contains('i-red'))
            $.ajax({
                url: "/wishlist/add-product",
                type: "POST",
                data: {
                    userID: userID,
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
                    userID: userID,
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

function sortChange(val) {
    console.log('Sort Products according to ' + val)
}
