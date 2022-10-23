
var count=0;
var count2=0;
function selectedsubcat(a){
    if(count!=0){
        var rem = document.querySelector('.selected').id;
        var remID = document.getElementById(rem);
        $(remID).removeClass("selected active");
    }
    var tabID = document.getElementById(a.id);
    $(tabID).addClass('selected');
    count++;
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

function openProduct(productID, variantID) {
    if (variantID) {
        location.href = '/product/variant/'+productID+'/'+variantID
    } else {
        location.href = '/product/view-product/'+productID
    }
}

function showmodal(imgsrc){
    $('#singleimg').attr('src', imgsrc)
    $('#imageModal').modal('show');
}
