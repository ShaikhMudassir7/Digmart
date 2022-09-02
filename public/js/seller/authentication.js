const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');
const emailOtp1 = document.getElementById('emailOtp1');
const emailOtp2 = document.getElementById('emailOtp2');
const emailOtp3 = document.getElementById('emailOtp3');
const emailOtp4 = document.getElementById('emailOtp4');
const submit = document.getElementById('submit');
const busMobile = document.getElementById('busMobile').innerHTML.trim();
const busEmail = document.getElementById('busEmail').innerHTML.trim();

mobOtp1.addEventListener('keyup', function (event) {
  if (event.key != "Backspace" && event.key != "Enter") {
    mobOtp2.focus();
  }
  checkMobileOtp()
});
mobOtp2.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp1.focus();
  } else if (event.key != "Enter") {
    mobOtp3.focus();
  }
  checkMobileOtp()
});
mobOtp3.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp2.focus();
  } else if (event.key != "Enter") {
    mobOtp4.focus();
  }
  checkMobileOtp()
});
mobOtp4.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    mobOtp3.focus();
  }
  checkMobileOtp()
});

emailOtp1.addEventListener('keyup', function (event) {
  if (event.key != "Backspace" && event.key != "Enter") {
    emailOtp2.focus();
  }
  checkEmailOtp()
});
emailOtp2.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp1.focus();
  } else if (event.key != "Enter") {
    emailOtp3.focus();
  }
  checkEmailOtp()
});
emailOtp3.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp2.focus();
  } else if (event.key != "Enter") {
    emailOtp4.focus();
  }
  checkEmailOtp()
});
emailOtp4.addEventListener('keyup', function (event) {
  if (event.key == "Backspace") {
    emailOtp3.focus();
  } else if (event.key == "Enter") {
  }
  checkEmailOtp()
});

function checkMobileOtp() {
  var otp = mobOtp1.value + mobOtp2.value + mobOtp3.value + mobOtp4.value
  if (otp.length == 4) {
    var elements = [mobOtp1, mobOtp2, mobOtp3, mobOtp4]
    $.ajax({
      url: "/seller/checkMobileOtp?busMobile=" + busMobile + "&otp=" + otp,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 'valid') {
          elements.forEach(element => {
            element.classList.remove('is-invalid')
            element.classList.add('is-valid')
            element.setAttribute("disabled", 'true')
          });
          if (emailOtp4.disabled)
            submit.removeAttribute('disabled');
        } else {
          elements.forEach(element => {
            element.classList.add('is-invalid')
          });
        }
      }
    })
  }
}

function checkEmailOtp() {
  var otp = emailOtp1.value + emailOtp2.value + emailOtp3.value + emailOtp4.value
  if (otp.length == 4) {
    var elements = [emailOtp1, emailOtp2, emailOtp3, emailOtp4]
    $.ajax({
      url: "/seller/checkEmailOtp?busEmail=" + busEmail + "&otp=" + otp,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 'valid') {
          elements.forEach(element => {
            element.classList.remove('is-invalid')
            element.classList.add('is-valid')
            element.setAttribute("disabled", "true")
          });
          if (mobOtp4.disabled)
            submit.removeAttribute('disabled');
        } else {
          elements.forEach(element => {
            element.classList.add('is-invalid')
          });
        }
      }
    })
  }
}