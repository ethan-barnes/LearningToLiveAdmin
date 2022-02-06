// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function FirebaseGet() {
    var myUrl = 'https://learningtolive-e4844-default-rtdb.europe-west1.firebasedatabase.app/.json'
    $.ajax({
        url: 'https://localhost:44369/Firebase/GetJson?url=' + myUrl,
        success: function (data) {
            console.log(data);
            document.getElementById("firebaseText").innerHTML = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //some errror, some show err msg to user and log the error  
            alert(xhr.responseText);
        }
    });
}