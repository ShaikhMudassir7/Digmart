const otp1 = document.getElementById('otp1');
const otp2 = document.getElementById('otp2');
const otp3 = document.getElementById('otp3');
const otp4 = document.getElementById('otp4');

otp1.addEventListener('keyup', function (event) {
    if (event.key != "Backspace" && event.key != "Enter") {
        otp2.focus();
    }
});
otp2.addEventListener('keyup', function (event) {
    if (event.key == "Backspace") {
        otp1.focus();
    } else if (event.key != "Enter") {
        otp3.focus();
    }
});
otp3.addEventListener('keyup', function (event) {
    if (event.key == "Backspace") {
        otp2.focus();
    } else if (event.key != "Enter") {
        otp4.focus();
    }
});
otp4.addEventListener('keyup', function (event) {
    if (event.key == "Backspace") {
        otp3.focus();
    } else if (event.key == "Enter") {
    }
});