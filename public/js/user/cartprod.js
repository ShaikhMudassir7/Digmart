function myFunction(op, cartid, ip, max, price) {
    var val = ip.value;
    let qty = document.getElementById(val).textContent;
    if (op == "add") {
        if (qty == parseInt(max)) {
            swal({
                title: "Seller does not have enough products",
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
                success: function () {
                    document.getElementById(val).innerHTML = qty
                    let finalsubtotal = document.getElementById('subtotal').textContent;
                    let finaltotal = document.getElementById('total').textContent;
                    var subtotal = parseFloat(finalsubtotal) + parseFloat(price);
                    var total = parseFloat(finaltotal) + parseFloat(price);
                    document.getElementById('total').innerHTML = total.toFixed(2);
                    document.getElementById('subtotal').innerHTML = subtotal.toFixed(2);
                }
            })
        }
    }
    else {
        if (qty > 1) {
            qty = parseInt(qty) - 1;
            $.ajax({
                url: '/cart/edit-cart',
                type: "POST",
                data: {
                    id: cartid,
                    qty: qty,
                },
                success: function () {
                    document.getElementById(val).innerHTML = qty
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