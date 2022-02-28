// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function FirebaseGet() {
    var dbUrl = 'https://learningtolive-e4844-default-rtdb.europe-west1.firebasedatabase.app/.json'
    var siteUrl = window.location.host;
    $.ajax({
        url: 'https://' + siteUrl + '/Firebase/GetJson?url=' + dbUrl,
        success: function (data) {
            displayFirebaseData(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //some errror, some show err msg to user and log the error  
            alert("Error reading firebase");
            console.log(xhr);
        }
    });
}

function displayFirebaseData(fbData) {
    // Prevents multiple button presses showing multiple data.
    document.getElementById("firebaseElements").innerHTML = ""; 

    var textToDisplay = "";
    var json = JSON.parse(fbData);
    console.log(json);

    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            console.log(key + " -> " + json[key]);

            // Create heading for each key in database
            var h3 = document.createElement("h3");
            var node = document.createTextNode(capitaliseFirstLetter(key));

            h3.appendChild(node);
            var div = document.getElementById("firebaseElements");
            div.appendChild(h3);

            for (var child in json[key]) {
                // Create heading for children of key
                var h5 = document.createElement("h5");
                var node1 = document.createTextNode(child.toString());

                h5.appendChild(node1);
                div.appendChild(h5);

                for (var child2 in json[key][child]) {
                    // Create list entry that will hold our link
                    var listElement = document.createElement("li");

                    var link = document.createElement("a");
                    var node2 = document.createTextNode(child2.toString());

                    link.setAttribute('href', json[key][child][child2]); // Add link to relevant resource
                    listElement.setAttribute('style', 'list-style: none'); // Remove bullet point
                    link.appendChild(node2);
                    listElement.appendChild(link);
                    div.appendChild(listElement);
                }
            }
        }
    }
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}