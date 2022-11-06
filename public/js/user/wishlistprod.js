function addcart(sellerID, productID, variantID, colour, size) {
    console.log("hi")
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
                    swal({
                        title: "Added to Cart Successfully",
                        icon: "success",
                    })
                }
            } else {
                swal({
                    title: "Already in the Cart",
                    icon: "info",
                })
            }
        }
    })
}

function openProduct(productID, variantID) {
    if (variantID) {
        location.href = '/product/variant/' + variantID
    } else {
        location.href = '/product/view-product/' + productID
    }
}