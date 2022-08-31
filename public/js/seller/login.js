const mobOtp1 = document.getElementById('mobOtp1');
const mobOtp2 = document.getElementById('mobOtp2');
const mobOtp3 = document.getElementById('mobOtp3');
const mobOtp4 = document.getElementById('mobOtp4');

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

function sendOTP() {
    var busMobile = document.getElementById('busMobile').value;
    var err = document.getElementById('busMobile_err')
    var err1 = document.getElementById('busMobile_err1')
    $.ajax({
        url: "/seller/send-sms?busMobile=" + busMobile,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        success: function (res) {
            if (res.status == 0) {
                err1.style.visibility = "hidden"
                err.style.visibility = "visible"
            } else if (res.status == 1) {
                err.style.visibility = "hidden"
                err1.style.visibility = "visible"
            } else {
                err.style.visibility = "hidden"
                err1.style.visibility = "hidden"
                document.getElementById('D_mobile').innerHTML = "+91 " + busMobile;
                document.getElementById('hidMobile').value = busMobile;
                $("#mobileModal").modal({ backdrop: "static" });
                $('#mobileModal').modal('show');
            }
        }
    })
}