function calculate(val1, val2) {
  var actualPrice = document.getElementById("actualPrice").value;
  var discountPct = document.getElementById("discount").value;
  var finalPriceField = document.getElementById("finalPrice");

  var total = (actualPrice * discountPct) / 100;
  var finalPrice = actualPrice - total;
  finalPrice = parseInt(finalPrice);
  finalPriceField.value = finalPrice;
}

function checkForm(form) {
  if ($('form')[0].checkValidity()) {
      form.submitData.disabled = true;
      form.submitData.innerText = "Please Wait";
      return true;
  }
}