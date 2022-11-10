const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');
const emailOtp1 = document.getElementById('emailOtp1');
const emailOtp2 = document.getElementById('emailOtp2');
const emailOtp3 = document.getElementById('emailOtp3');
const emailOtp4 = document.getElementById('emailOtp4');
const submit1 = document.getElementById('submit1');
const submit2 = document.getElementById('submit2');
const mobTimer = document.getElementById('mobTimer')
const emailTimer = document.getElementById('emailTimer')
const mobResend = document.getElementById('mobResend')
const mobResendstr = document.getElementById('mobResendstr')
const emailResend = document.getElementById('emailResend')
const emailResendstr = document.getElementById('emailResendstr')
var busMobile, busEmail;

mobOtp1.addEventListener('keyup', function(event) {
    if (event.key != "Backspace" && event.key != "Enter") {
        mobOtp2.focus();
    }
    checkMobileOtp()
});
mobOtp2.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        mobOtp1.focus();
    } else if (event.key != "Enter") {
        mobOtp3.focus();
    }
    checkMobileOtp()
});
mobOtp3.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        mobOtp2.focus();
    } else if (event.key != "Enter") {
        mobOtp4.focus();
    }
    checkMobileOtp()
});
mobOtp4.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        mobOtp3.focus();
    }
    checkMobileOtp()
});

emailOtp1.addEventListener('keyup', function(event) {
    if (event.key != "Backspace" && event.key != "Enter") {
        emailOtp2.focus();
    }
    checkEmailOtp()
});
emailOtp2.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        emailOtp1.focus();
    } else if (event.key != "Enter") {
        emailOtp3.focus();
    }
    checkEmailOtp()
});
emailOtp3.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        emailOtp2.focus();
    } else if (event.key != "Enter") {
        emailOtp4.focus();
    }
    checkEmailOtp()
});
emailOtp4.addEventListener('keyup', function(event) {
    if (event.key == "Backspace") {
        emailOtp3.focus();
    } else if (event.key == "Enter") {}
    checkEmailOtp()
});

function sendOTP() {
    var cred = document.getElementById('credential');
    var err = document.getElementById('err');
    var errMsg = document.getElementById('errMsg');
    var credVal = cred.value
    let emailRegex = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
    let mobileRegex = new RegExp('^[0-9]{10}$');
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    document.body.appendChild(form);

    if (emailRegex.test(credVal)) {
        busEmail = credVal;
        cred.classList.remove('is-invalid')
        err.style.display = "none"
        $.ajax({
            url: "/seller/sendOtp?busEmail=" + credVal,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            success: function(res) {
                if (res.status == 0) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "No Seller found!"
                    err.style.display = "block"
                } else if (res.status == 2) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "Seller Verification Pending!"
                    err.style.display = "block"
                } else if (res.status == 1) {
                    form.setAttribute("action", "/seller/reauthenticate?busMobile=" + res.busMobile + "&busEmail=" + res.busEmail);
                    form.submit()
                } else {
                    cred.classList.remove('is-invalid')
                    cred.classList.add('is-valid')
                    err.style.display = "block"
                    document.getElementById('busEmail').innerHTML = credVal;
                    document.getElementById('hidEmail').value = credVal;
                    $("#emailModal").modal({ backdrop: "static" });
                    $('#emailModal').modal('show');
                    emailTimer.style.display = "inline"
                    emailResend.classList.remove('timer-active')
                    emailResend.classList.add('timer-inactive')
                    timer(30);
                }
            }
        })
    } else if (mobileRegex.test(credVal)) {
        busMobile = credVal
        cred.classList.remove('is-invalid')
        err.style.display = "none"
        $.ajax({
            url: "/seller/sendOtp?busMobile=" + credVal,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            success: function(res) {
                if (res.status == 0) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "No Seller found!"
                    err.style.display = "block"
                } else if (res.status == 2) {
                    cred.classList.add('is-invalid')
                    errMsg.innerHTML = "Seller Verification Pending!"
                    err.style.display = "block"
                } else if (res.status == 1) {
                    form.setAttribute("action", "/seller/reauthenticate?busMobile=" + res.busMobile + "&busEmail=" + res.busEmail);
                    form.submit();
                } else {
                    cred.classList.remove('is-invalid')
                    cred.classList.add('is-valid')
                    err.style.display = "block"
                    document.getElementById('busMobile').innerHTML = "+91 " + credVal;
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
            url: "/seller/checkMobileOtp?busMobile=" + busMobile + "&otp=" + otp,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            success: function(res) {
                if (res.status == 'valid') {
                    elements.forEach(element => {
                        element.classList.remove('is-invalid')
                        element.classList.add('is-valid')
                        element.setAttribute("disabled", 'true')
                    });
                    submit1.removeAttribute('disabled');
                    mobResendstr.style.display = 'none'
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
            success: function(res) {
                if (res.status == 'valid') {
                    elements.forEach(element => {
                        element.classList.remove('is-invalid')
                        element.classList.add('is-valid')
                        element.setAttribute("disabled", "true")
                    });
                    submit2.removeAttribute('disabled');
                    emailResendstr.style.display = 'none'
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
        setTimeout(function() {
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