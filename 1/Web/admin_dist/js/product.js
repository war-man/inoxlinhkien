﻿var ref;
ref = $("#myTable").DataTable({ "scrollX": true });
var button1 = document.getElementById('ckfinder-popup-1');
$(document).ready(function () {
    loaddatabyHung();
    loadcategoryid();
    //button1.onclick = function () {
    //    selectFileWithCKFinder('ckfinder-input-1');
    //};
});
//ckfinder
function selectFileWithCKFinder() {
    CKFinder.modal({
        chooseFiles: true,
        width: 800,
        height: 600
        //onInit: function (finder) {
        //    finder.on('files:choose', function (evt) {
        //        var file = evt.data.files.first();
        //        var output = document.getElementById('ckfinder-input-1');
        //        output.value = file.getUrl();
        //    });

        //    finder.on('file:choose:resizedImage', function (evt) {
        //        var output = document.getElementById('ckfinder-input-1');
        //        output.value = evt.data.resizedUrl;
        //    });
        //}
    });
}
// load data by Hung
function loaddatabyHung() {
    ref.clear().draw();
    var html = '';
    $.ajax({
        url: "/Base/GetAllProduct",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $.each(result, function (key, item) {
                html = '<a href="#" onclick="showcontent(' + item.Id + ');"> Chi tiết </a> | <a href="#" onclick="return getbyID(' + item.Id + ');"> Chỉnh sửa</a> | <a href="#" onclick="Delete(' + item.Id + ');">Xóa</a>';
                htmlimage = '<button type="button" id="ckfinder-popup-1" onclick="selectFileWithCKFinder()"> abc</button>';
                //<img src="' + item.Image.split(" ")[0] + '" class="img-responsive">
                ref.row.add([
                    item.Id,
                    item.Name,
                    item.MadeFrom,
                    item.CategoryId,                 
                    htmlimage,
                    html
                ]);
            });
            ref.draw(false);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
function loadcategoryid() {
    $.ajax({
        url: "/Base/GetAllCategory",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<option value="' + item.CategoryId + '">' + item.CategoryName + '</option>';
            });
            $("#CategoryId").html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
// Show content popup hiển thị chi tiết nội dung category đó
function showcontent(id) {
    $.ajax({
        url: "/Base/GetProductById/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Remark) {
                $('#modalshowcontent_body').html(result.Remark);
            }
            else {
                $('#modalshowcontent_body').html('Không có mô tả');
            }
            $('#modalshowcontent').modal('show');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
// function lấy dữ liệu theo category ID để chỉnh sửa
function getbyID(ID) {
    $('#Id').css('border-color', 'lightgrey');
    $('#Id').attr('disabled', 'disabled');
    $('#Name').css('border-color', 'lightgrey');
    $('#MadeFrom').css('border-color', 'lightgrey');
    $('#CategoryId').css('border-color', 'lightgrey');
    $('#Dimenson').css('border-color', 'lightgrey');
    $('#Image').css('border-color', 'lightgrey');
    $('#Remark').css('border-color', 'lightgrey');
    $.ajax({
        url: "/Base/GetProductById/" + ID,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#Id').val(result.Id);
            $('#Name').val(result.Name);
            $('#MadeFrom').val(result.MadeFrom);

            $('#CategoryId').find('option').remove().end();
            $('#CategoryId').append('<option value="' + result.CategoryId + '">' + result.CategoryName + '</option>');

            $('#Dimenson').val(result.Dimenson);
            $('#Image').val(result.Image);
            CKEDITOR.instances['Remark'].setData(result.Remark);

            $('#myModalLabel').html('<span class="glyphicon glyphicon-envelope"></span> Chỉnh sửa sản phẩm');
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

// function validate khi thêm mới hoặc chỉnh sửa
function validate() {
    var isvalidate = true;
    if ($('#Id').val().trim() === "") {
        $('#Id').css('border-color', 'red');
        isvalidate = false;
    }
    else {
        $('#Id').css('border-color', 'lightgrey');
    }

    if ($('#Name').val().trim() === "") {
        $('#Name').css('border-color', 'red');
        isvalidate = false;
    }
    else {
        $('#Name').css('border-color', 'lightgrey');
    }


    if ($('#MadeFrom').val().trim() === "") {
        $('#MadeFrom').css('border-color', 'red');
        isvalidate = false;
    }
    else {
        $('#MadeFrom').css('border-color', 'lightgrey');
    }

    if ($('#Dimenson').val().trim() === "") {
        $('#Dimenson').css('border-color', 'red');
        isvalidate = false;
    }
    else {
        $('#Dimenson').css('border-color', 'lightgrey');
    }

    if ($('#Image').val().trim() === "") {
        $('#Image').css('border-color', 'red');
        isvalidate = false;
    }
    else {
        $('#Image').css('border-color', 'lightgrey');
    }
    return isvalidate;
}


// Script cho phan Add: them moi Content
function Add() {
    //alert(CKEDITOR.instances['Remarks'].getData());  
    var res = validate();
    if (res == false) {
        return false;
    }
    var product =
    {
        Id: $('#Id').val(),
        Name: $('#Name').val(),
        MadeFrom: $('#MadeFrom').val(),
        CategoryId: $('#CategoryId').val(),
        Dimenson: $('#Dimenson').val(),
        Image: $('#Image').val(),
        Remark: CKEDITOR.instances['Remark'].getData(),
        Status:1
    };
    //alert(JSON.stringify(category));
    $.ajax({
        url: "/Base/InsertProduct",
        data: JSON.stringify(product),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        success: function (result) {
            bootbox.alert('Thêm mới thành công!');
            loaddatabyHung();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

}

// fucntion Update dữ liệu
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var product =
    {
        Id: $('#Id').val(),
        Name: $('#Name').val(),
        MadeFrom: $('#MadeFrom').val(),
        CategoryId: $('#CategoryId').val(),
        Dimenson: $('#Dimenson').val(),
        Image: $('#Image').val(),
        Remark: CKEDITOR.instances['Remark'].getData(),
        Status: 1
    };

    $.ajax({
        url: "/Base/UpdateProduct",
        data: JSON.stringify(product),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        success: function (result) {
            bootbox.alert('Update thành công!');
            loaddatabyHung();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

}
// function clear text box trong modal
function clearTextBox() {
    $('#Id').val("");
    $('#Name').val("");
    $('#MadeFrom').val("");
    $('#CategoryId').find('option').remove().end();
    $('#Dimenson').val("");
    $('#Image').val("");
    //$('#Remarks').val("");
    CKEDITOR.instances['Remark'].setData("")

    $('#Id').removeAttr('disabled');
    $('#Name').removeAttr('disabled');
    $('#MadeFrom').removeAttr('disabled');
    $('#CategoryId').removeAttr('disabled');
    $('#Dimenson').removeAttr('disabled');
    $('#Image').removeAttr('disabled');
    $('#Remark').removeAttr('disabled');

    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#Name').css('border-color', 'lightgrey');
    $('#CategoryId').css('border-color', 'lightgrey');
    $('#Dimenson').css('border-color', 'lightgrey');
    $('#Remark').css('border-color', 'lightgrey');

}
// mở popup khi bấm nút add category
function addpopup() {
    $('#myModalLabel').html('<h4><span class="glyphicon glyphicon-envelope"></span> Thêm mới sản phẩm</h4>');
    $('#myModal').modal('show');
    clearTextBox();
    loadcategoryid();
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $.ajax({
        url: "/Base/GetNextProductId",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#Id').val(result);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

// function delete ID
function Delete(ID) {
    bootbox.confirm({
        title: "Xóa?",
        message: "Bạn có muốn xóa không?",
        buttons: {
            cancel: {
                label: '<i class="glyphicon glyphicon-remove"></i> Hủy bỏ'
            },
            confirm: {
                label: '<i class="glyphicon glyphicon-ok"></i> Xác nhận'
            }
        },
        callback: function (a) {
            if (a) {
                $.ajax({
                    url: "/Base/DeleteProduct/" + ID,
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function (result) {
                        bootbox.alert("Xóa thành công!");
                        loaddatabyHung();
                    },
                    error: function (errormessage) {
                        alert(errormessage.responseText);
                    }
                });
            }
        }
    });
}

