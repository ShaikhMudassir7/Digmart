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

function searchProd(el, tab) {
    const products = document.querySelectorAll(tab + ' .prodContainer');
    var value = el.value.trim().toLowerCase()
    if (value != '') {
        products.forEach((prod) => {
            if (prod.querySelector('.prodName').innerHTML.trim().toLowerCase().includes(value)) {
                prod.style.display = 'block'
            } else {
                prod.style.display = 'none'
            }
        })
    } else {
        products.forEach((prod) => {
            prod.style.display = 'block'
        })
    }
}

function sortProd(val, tab) {
    const products = Array.from(document.querySelectorAll(tab + ' .prodContainer'))
    switch (val) {
        case 'Price Low to High':
            prodSort('.prodPrice', 'ascend')
            break
        case 'Price High to Low':
            prodSort('.prodPrice', 'descend')
            break
        case 'Discounts':
            prodSort('.prodDiscount', 'descend')
            break    
        default:
            products.forEach((prod) => {
                prod.style.order = ''
            })
            break
    }

    function prodSort(selector, type) {
        var productsWithout = []
        if (selector == '.prodDiscount') {
            products.forEach((prod, index, arr) => {
                if (prod.querySelector(selector) == null) {
                    arr.splice(index, 1)
                    productsWithout.push(prod)
                }
            })
            productsWithout.forEach((prod) => {
                prod.style.order = products.length + 1
            })
        }

        products.sort(function (a, b) {
            a = a.querySelector(selector).innerHTML
            b = b.querySelector(selector).innerHTML
            if (type == 'ascend')
                return a - b
            else
                return b - a
        })

        var i = 1
        products.forEach((prod) => {
            prod.style.order = i
            i++
        })
    }
}
