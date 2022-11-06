function myFunction(op, cartid, ip, max, price) {
    var val = ip.value;
    let qty = document.getElementById(val).value;
    if (op == "add") {
        if (qty == parseInt(max)) {
            swal({
                title: "Product Max Quantity Reached",
                icon: "info",
                dangerMode: false,
            })
        } else {
            qty = parseInt(qty) + 1;
            $.ajax({
                url: '/cart/edit-cart',
                type: "POST",
                data: {
                    id: cartid,
                    qty: qty,
                },
                success: function() {
                    document.getElementById(val).value = qty
                    let finalsubtotal = document.getElementById('subtotal').textContent;
                    let finaltotal = document.getElementById('total').textContent;
                    var subtotal = parseFloat(finalsubtotal) + parseFloat(price);
                    var total = parseFloat(finaltotal) + parseFloat(price);
                    document.getElementById('total').innerHTML = total.toFixed(2);
                    document.getElementById('subtotal').innerHTML = subtotal.toFixed(2);
                }
            })
        }
    } else {
        if (qty > 1) {
            qty = parseInt(qty) - 1;
            $.ajax({
                url: '/cart/edit-cart',
                type: "POST",
                data: {
                    id: cartid,
                    qty: qty,
                },
                success: function() {
                    document.getElementById(val).value = qty
                    let finalsubtotal = document.getElementById('subtotal').textContent;
                    let finaltotal = document.getElementById('total').textContent;
                    var subtotal = parseFloat(finalsubtotal) - parseFloat(price);
                    var total = parseFloat(finaltotal) - parseFloat(price);
                    document.getElementById('total').innerHTML = total.toFixed(2);
                    document.getElementById('subtotal').innerHTML = subtotal.toFixed(2);
                }
            })
        }
    }
}

function openProduct(productID, variantID) {
    if (variantID) {
        location.href = '/product/variant/' + variantID
    } else {
        location.href = '/product/view-product/' + productID
    }
}