const formA = document.getElementById('formA');


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



formA.addEventListener('submit', function (event) {
  if (this.submitted == "1") {
    // will execute if submit event is generated through 1st button
    event.preventDefault()
    event.stopPropagation()

    if (formA.checkValidity()) {
      var bankAccNo = document.getElementById('bankAccNo').value;
      var bankAccNo2 = document.getElementById('bankAccNo2').value;
      if (bankAccNo != bankAccNo2) {
        document.getElementById('reaccno_err').style.visibility = "visible";
      } else {
        document.getElementById('reaccno_err').style.visibility = "hidden";
        var pMobile = document.getElementById('pMobile').value;
        document.getElementById('D_mobile').innerHTML = "+91 " + pMobile;
        $("#exampleModal").modal({ backdrop: "static" });
        $('#exampleModal').modal('show');
      }
    }
  } else {
    // will execute if submit event is generated through otp submit button
    const otp = otp1.value + otp2.value + otp3.value + otp4.value;
    if (otp == "1111") {
      $('#exampleModal').modal('hide');
      console.log("Details Submitted");
    } else {
      event.preventDefault()
      event.stopPropagation()
      $('#exampleModal').modal('hide');
      alert("Invalid OTP! \n\n Please try again");
    }
  }
}, false)


$("#backbtn").click(function () {
  window.open("/seller/login", "_self");
});


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