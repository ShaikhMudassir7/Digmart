function findsize(prodID,colours){
    $.ajax({
        url: "/product/findsize/"+ prodID +"/" + colours,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        success: function (res) {
                console.log(res);
        }
    })
}