function addcart(sellerID, productID, variantID,colour,size) {
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