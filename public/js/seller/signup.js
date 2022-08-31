const signupForm = document.getElementById('signupForm');

const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');
const emailOtp1 = document.getElementById('emailOtp1');
const emailOtp2 = document.getElementById('emailOtp2');
const emailOtp3 = document.getElementById('emailOtp3');
const emailOtp4 = document.getElementById('emailOtp4');

mobOtp1.addEventListener('keyup', function (event) {
  if (event.key != "Backspace" && event.key != "Enter") {
    mobOtp2.focus();
  }
});
mobOtp2.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp1.focus();
  } else if (event.key != "Enter") {
    mobOtp3.focus();
  }
});
mobOtp3.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp2.focus();
  } else if (event.key != "Enter") {
    mobOtp4.focus();
  }
});
mobOtp4.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp3.focus();
  } else if (event.key == "Enter") {
  }
});

emailOtp1.addEventListener('keyup', function (event) {
  if (event.key != "Backspace" && event.key != "Enter") {
    emailOtp2.focus();
  }
});
emailOtp2.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp1.focus();
  } else if (event.key != "Enter") {
    emailOtp3.focus();
  }
});
emailOtp3.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp2.focus();
  } else if (event.key != "Enter") {
    emailOtp4.focus();
  }
});
emailOtp4.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp3.focus();
  } else if (event.key == "Enter") {
  }
});

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

signupForm.addEventListener('submit', function (event) {
  var busMobile = document.getElementById('busMobile').value;
  var busEmail = document.getElementById('busEmail').value;
  if (this.submitted == "1") {
    event.preventDefault()
    event.stopPropagation()
    if (signupForm.checkValidity()) {
      $.ajax({
        url: "/seller/sendMobileOtp?busMobile=" + busMobile,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        success: function (res) {
          if (res.status == 'sent') {
            document.getElementById('D_mobile').innerHTML = "+91 " + busMobile;
            $("#mobileModal").modal({ backdrop: "static" });
            $('#mobileModal').modal('show');
          }
        }
      })
    }
  } else if (this.submitted == "2") {
    event.preventDefault()
    event.stopPropagation()
    var enteredOtp = mobOtp1.value + mobOtp2.value + mobOtp3.value + mobOtp4.value;
    $.ajax({
      url: "/seller/sendEmailOtp?busEmail=" + busEmail + "&enteredOtp=" + enteredOtp,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 'sent') {
          $('mobileModal').modal('hide');
          document.getElementById('D_email').innerHTML = busEmail;
          $("#emailModal").modal({ backdrop: "static" });
          $('#emailModal').modal('show');
        } else {
          alert("Invalid OTP! \n\n Please try again");
        }
      }
    })
  } else if (this.submitted == "3") {

    var enteredOtp = emailOtp1.value + emailOtp2.value + emailOtp3.value + emailOtp4.value;
    $.ajax({
      url: "/seller/checkEmailOtp?enteredOtp=" + enteredOtp,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 'valid') {
          $('emailModal').modal('hide');
        } else {
          event.preventDefault()
          event.stopPropagation()
          alert("Invalid OTP! \n\n Please try again");
        }
      }
    })
  }
}, false)

// Scroll Back To Top 
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