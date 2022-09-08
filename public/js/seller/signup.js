const busGstNo = document.getElementById('busGstNo')

function check(toCheck, val, errMsg) {
  var btn = document.getElementById('submit1')
  $.ajax({
    url: "/seller/check?toCheck=" + toCheck + "&val=" + val,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    success: function (res) {
      var err = document.getElementById(errMsg)
      if (res.gst == 'true') {
        err.style.display = "none"
        var busGstNo_err = document.getElementById('busGstNo_err').style.display
        var busMobile_err = document.getElementById('busMobile_err').style.display
        var busEmail_err = document.getElementById('busEmail_err').style.display
        if (busMobile_err == 'none' && busEmail_err == 'none' && busGstNo_err == 'none')
          btn.removeAttribute('disabled')
      } else {
        err.style.display = "block"
        btn.setAttribute('disabled', "disabled")
      }
    }
  })
}

function checkAccNo(accno) {
  var ogAccno = document.getElementById('bankAccNo').value
  var reAccNo = document.getElementById('bankAccNo2')
  var err = document.getElementById('reaccno_err')
  var btn = document.getElementById('submit1')
  if (ogAccno == accno) {
    reAccNo.classList.remove('is-invalid')
    err.style.display = "none"
    btn.removeAttribute('disabled')
  } else {
    reAccNo.classList.add('is-invalid')
    err.style.display = "block"
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