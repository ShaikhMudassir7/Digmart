const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');
const emailOtp1 = document.getElementById('emailOtp1');
const emailOtp2 = document.getElementById('emailOtp2');
const emailOtp3 = document.getElementById('emailOtp3');
const emailOtp4 = document.getElementById('emailOtp4');
const submit = document.getElementById('submit');
const busMobile = document.getElementById('hidMobile').value
const busEmail = document.getElementById('busEmail').innerHTML.trim();
const mobTimer = document.getElementById('mobTimer')
const emailTimer = document.getElementById('emailTimer')
const mobResend = document.getElementById('mobResend')
const mobResendstr = document.getElementById('mobResendstr')
const emailResend = document.getElementById('emailResend')
const emailResendstr = document.getElementById('emailResendstr')

document.addEventListener('DOMContentLoaded', function () {
  mobTimerFunc(30);
  emailTimerFunc(30);
}, false);

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
      url: "/seller/checkOtp",
      type: "POST",
      data: {
        toFind: 'busMobile',
        val: busMobile,
        toCheck: 'mobileOtp',
        otp: otp
      },
      dataType: 'json',
      success: function (res) {
        if (res.status) {
          elements.forEach(element => {
            element.classList.remove('is-invalid')
            element.classList.add('is-valid')
            element.setAttribute("disabled", 'true')
          });
          mobResendstr.style.display = 'none'
          if (emailOtp4.disabled)
            submit.removeAttribute('disabled');
        } else {
          elements.forEach(element => {
            element.classList.add('is-invalid')
          })
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
      url: "/seller/checkOtp",
      type: "POST",
      data: {
        toFind: 'busEmail',
        val: busEmail,
        toCheck: 'emailOtp',
        otp: otp
      },
      dataType: 'json',
      success: function (res) {
        if (res.status) {
          elements.forEach(element => {
            element.classList.remove('is-invalid')
            element.classList.add('is-valid')
            element.setAttribute("disabled", "true")
          });
          emailResendstr.style.display = 'none'
          if (mobOtp4.disabled)
            submit.removeAttribute('disabled')
        } else {
          elements.forEach(element => {
            element.classList.add('is-invalid')
          })
        }
      }
    })
  }
}

function mobTimerFunc(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  mobTimer.innerHTML = '(' + m + ':' + s + ')';
  remaining -= 1;

  if (remaining >= 0) {
    setTimeout(function () {
      mobTimerFunc(remaining);
    }, 1000);
    return;
  } else {
    mobTimer.style.display = "none"
    mobResend.classList.remove('timer-inactive')
    mobResend.classList.add('timer-active')
  }
}

function emailTimerFunc(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  emailTimer.innerHTML = '(' + m + ':' + s + ')';
  remaining -= 1;

  if (remaining >= 0) {
    setTimeout(function () {
      emailTimerFunc(remaining);
    }, 1000);
    return;
  } else {
    emailTimer.style.display = "none"
    emailResend.classList.remove('timer-inactive')
    emailResend.classList.add('timer-active')
  }
}

function sendOTP(check, val) {
  if (check == 1) {
    $.ajax({
      url: "/seller/sendMobileOtp?busMobile=" + val,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 1) {
          mobTimer.style.display = "inline"
          mobResend.classList.remove('timer-active')
          mobResend.classList.add('timer-inactive')
          mobTimerFunc(30);
        }
      }
    })
  } else {
    $.ajax({
      url: "/seller/sendEmailOtp?busEmail=" + val,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (res.status == 1) {
          emailTimer.style.display = "inline"
          emailResend.classList.remove('timer-active')
          emailResend.classList.add('timer-inactive')
          emailTimerFunc(30);
        }
      }
    })
  }

}