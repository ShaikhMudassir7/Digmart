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
        if (result.status){
          swal({
            title: "Added to Wishlist Successfully",
            icon: "success",
            dangerMode: false,
        })
        }
        else{
          swal({
            title: "Already in the Wishlist",
            icon: "info",
            dangerMode: false,
        })
        }
      }
    })
  }


  function addcart(sellerID, productID, variantID,colour) {
    if(document.getElementById("0size")){
      var size = document.getElementById(count+'size').innerText;
    }
    else{
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
        success: function (result) {
          if (result.status){
          swal({
            title: "Added to Cart Successfully",
            icon: "success",
            dangerMode: false,
        })}
        else{
          swal({
            title: "Already in the Cart",
            icon: "info",
            dangerMode: false,
        })
        }
        }
      })
    }