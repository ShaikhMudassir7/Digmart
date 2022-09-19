const finalPrice = document.getElementById("finalPrice");
const actualPrice = document.getElementById("actualPrice");
const discount = document.getElementById("discount");
const noDiscount = document.getElementById("noDiscount");
const withDiscount = document.getElementById("withDiscount");


function findsize(){
    const btnval = this.value;
    if("<%=variantData.sizes[btnval].discount%>" == null){
        withDiscount.style.display = "none"
        noDiscount.style.display = "inline"
    }
    else{
        withDiscount.style.display = "inline"
        noDiscount.style.display = "none"
        finalPrice.innerText = "₹ <%=variantData.sizes[btnval].finalPrice%>"
        actualPrice.innerText = "₹ <%=variantData.sizes[btnval].actualPrice%>"
        discount.innerText = "<%=variantData.sizes[btnval].discount%>% off"
    }
   
}