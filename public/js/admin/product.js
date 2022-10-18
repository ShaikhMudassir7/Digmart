var btnval;
function check(abc) {
    btnval = abc.value;
    if (document.getElementById(btnval + "accept").classList.contains("active")) {
        document.getElementById(btnval + "accept").classList.remove("active");
    }
    if (document.getElementById(btnval + "reject").classList.contains("active")) {
        document.getElementById(btnval + "reject").classList.remove("active");
    }
    document.getElementById(abc.id).classList.add("active");
    if (document.getElementById(btnval + "accept").classList.contains("active")) {
        var status="Verified"
        $.ajax({
            url: "/admin/verification/verify-variant",
            type: "POST",
            data: {
                variantID: btnval,
                status: status,
            },
            success: function () {
                swal({
                    title: "Variant Verified",
                    icon: "success",
                })
            }
        })
    }else{
        $('#variantBackdrop').modal('show');
    }
    
}

function chkmodal(val){
val="Rejected : " +document.getElementById("varrejectText").value
$('#variantBackdrop').modal('hide');
$.ajax({
    url: "/admin/verification/verify-variant",
    type: "POST",
    data: {
        variantID: btnval,
        status: val,
    },
    success: function () {
        swal({
            title: "Variant Rejected",
            icon: "warning",
            dangerMode: true,
        })
    }
})
}

function checkvariant(id,status) {
    $.ajax({
        url: "/admin/verification/check-variant",
        type: "POST",
        data: {
            productID: id,
            status: status,
        },
        dataType: 'json',
        success: function (result) {
            if (result.status){
                $.ajax({
                    url: "/admin/verification/accept-product/"+id,
                    type: "GET",
                    success: function () {
                        swal({
                            title: "Product Verfied",
                            icon: "success",
                        }).then(function() {
                            window.location = "/admin/verification/product";
                        });
                    }
                })
               
            }else{
                swal({
                    title: "Pending Variants are Still left",
                    icon: "warning",
                    dangerMode: true,
                })
            } 
        }
    })
}

function rejectproduct(id) {
    $.ajax({
        url: "/admin/verification/reject-product",
        type: "POST",
        data: {
            productID: id,
            status: "Rejected : " +document.getElementById("rejectText").value,
        },
        success: function () {
            swal({
                title: "Product Rejected",
                icon: "warning",
                dangerMode: true,
            }).then(function() {
                window.location = "/admin/verification/product";
            });
        }
    })
}