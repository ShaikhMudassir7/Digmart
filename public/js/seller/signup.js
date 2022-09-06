function checkGst(gst) {
  $.ajax({
    url: "/seller/checkGst?gst=" + gst,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    success: function (res) {
      console.log(res.gst)
      var err = document.getElementById('busGstNo_err')
      var btn = document.getElementById('submit1')
      if (res.gst == 'true') {
        err.style.visibility = "hidden"
        btn.removeAttribute('disabled')
      } else {
        err.style.visibility = "visible"
        btn.setAttribute('disabled', "disabled")
      }
    }
  })
}

function checkAccNo(accno) {
  var ogAccno = document.getElementById('bankAccNo').value
  var err = document.getElementById('reaccno_err')
  var btn = document.getElementById('submit1')
  if (ogAccno == accno) {
    err.style.visibility = "hidden"
    btn.removeAttribute('disabled')
  } else {
    err.style.visibility = "visible"
    btn.setAttribute('disabled', "disabled")
  }
}

function scrollTopBack() {
  let scrollTopButton = document.querySelector("#scrollUp");
  window.onscroll = function () {
    var scroll = document.documentElement.scrollTop;
    if (scroll >= 250) {
      scrollTopButton.classList.add('scrollActive');
    } else {
      scrollTopButton.classList.remove('scrollActive');
    }
  }
}
scrollTopBack();