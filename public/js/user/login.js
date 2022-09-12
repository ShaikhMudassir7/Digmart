const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');

const submit1 = document.getElementById('submit');
const mobTimer = document.getElementById('mobTimer')
const mobResend = document.getElementById('mobResend')
var mobile;

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

function sendOTP() {
    
    var err = document.getElementById('err');
    var errMsg = document.getElementById('errMsg');
    let mobileRegex = new RegExp('^[0-9]{10}$');
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    document.body.appendChild(form);

    if (mobileRegex.test(credVal)) {
        mobile = credVal
        err.style.display = "none"
        $.ajax({
            url: "/user/sendOtp?mobile=" + credVal,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            success: function (res) {
                if (res.status == 0) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "No Seller found!"
                    err.style.display = "block"
                } else if (res.status == 2) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "Verification Pending! Plz contact Admin"
                    err.style.display = "block"
                } else if (res.status == 1) {
                    form.setAttribute("action", "/seller/reauthenticate?mobile=" + res.mobile + "&busEmail=" + res.busEmail);
                    form.submit();
                } else {
                    cred.classList.remove('is-invalid')
                    cred.classList.add('is-valid')
                    err.style.display = "block"
                    document.getElementById('mobile').innerHTML = "+91 " + credVal;
                    document.getElementById('hidMobile').value = credVal;
                    $("#mobileModal").modal({ backdrop: "static" });
                    $('#mobileModal').modal('show');
                    mobTimer.style.display = "inline"
                    mobResend.classList.remove('timer-active')
                    mobResend.classList.add('timer-inactive')
                    timer(30);
                }
            }
        })
    } else {
        cred.classList.add('is-invalid')
        errMsg.innerHTML = "Plz check the enetred credentials"
        err.style.display = "block"
    }
}

function checkMobileOtp() {
    var otp = mobOtp1.value + mobOtp2.value + mobOtp3.value + mobOtp4.value
    if (otp.length == 4) {
        var elements = [mobOtp1, mobOtp2, mobOtp3, mobOtp4]
        $.ajax({
            url: "/seller/checkMobileOtp?mobile=" + mobile + "&otp=" + otp,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            success: function (res) {
                if (res.status == 'valid') {
                    elements.forEach(element => {
                        element.classList.remove('is-invalid')
                        element.classList.add('is-valid')
                        element.setAttribute("disabled", 'true')
                    });
                    submit1.removeAttribute('disabled');
                } else {
                    elements.forEach(element => {
                        element.classList.add('is-invalid')
                    });
                }
            }
        })
    }
}

function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    mobTimer.innerHTML = '(' + m + ':' + s + ')';
    emailTimer.innerHTML = '(' + m + ':' + s + ')';
    remaining -= 1;

    if (remaining >= 0) {
        setTimeout(function () {
            timer(remaining);
        }, 1000);
        return;
    } else {
        mobTimer.style.display = "none"
        emailTimer.style.display = "none"
        mobResend.classList.remove('timer-inactive')
        emailResend.classList.remove('timer-inactive')
        mobResend.classList.add('timer-active')
        emailResend.classList.add('timer-active')
    }
}