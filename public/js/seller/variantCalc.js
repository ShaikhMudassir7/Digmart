var checkSizes = [];
$(document).on('click', '#submitVariantData', function (e) {
  var sizesElements = document.getElementsByName("sizes[]");
  var noEmptyElement = true
  for (var i = 0; i < sizesElements.length; i++) {
    checkSizes.push(sizesElements[i].value)
  }
  if (checkSizes.includes("")) {
    noEmptyElement = false
  }
  var hasDuplicateSizes = hasDuplicates(checkSizes);
  if (hasDuplicateSizes && noEmptyElement) {
    e.preventDefault();
    swal({
      title: "You cannot insert duplicate sizes.",
      icon: "warning",
      dangerMode: true,
    })
  }
  checkSizes = [];
});

function hasDuplicates(checkSizes) {
  if (checkSizes.length != new Set(checkSizes).size) {
    return true;
  }
  return false;
}


function calculateMoreFields(val1, val2, counter) {
  var actualPrice = document.getElementById("actualPrice" + counter).value;
  var discountPct = document.getElementById("discount" + counter).value;
  var finalPriceField = document.getElementById("finalPrice" + counter);

  var total = (actualPrice * discountPct) / 100;
  var finalPrice = actualPrice - total;
  finalPriceField.value = finalPrice;
}

function checkFormVariant(form) {
  if ($('form')[0].checkValidity()) {
      form.submitVariantData.disabled = true;
      form.submitVariantData.innerText = "Please Wait";
      return true;
  }
}