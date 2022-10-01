function addwishlist(sellerID, productID, variantID) {
  if(document.getElementById("0size")){
    var size = document.getElementById(count+'size').innerText;
  }
  else{
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
      success: function (result) {
        if (result)
          alert("Added succesfully")
      }
    })
  }