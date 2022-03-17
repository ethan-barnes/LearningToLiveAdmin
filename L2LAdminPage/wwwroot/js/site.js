var collapsableListDivs = [];
var divNum = 0;
var siteUrl = window.location.host;
var dbUrl;

function FirebaseSend() {
    console.log("firebase send");
}

function FirebaseGet(country) {
    dbUrl = 'https://learningtolive-e4844-default-rtdb.europe-west1.firebasedatabase.app/' + country;
    $.ajax({
        url: 'https://' + siteUrl + '/Firebase/GetJson?url=' + dbUrl + '.json',
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
    document.getElementById("accordion").innerHTML = "";

    var json = JSON.parse(fbData);
    console.log(json);

    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            // Create heading for each key in database
            var h3 = document.createElement("h3");
            var node = document.createTextNode(capitaliseFirstLetter(key));
            h3.appendChild(node);

            document.getElementById("accordion").appendChild(createBootstrapCard(key + 'Heading', key, json[key]));
        }
    }
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            for (var child in json[key]) {
                // Create heading for children of key
                var h5 = document.createElement("h5");
                var node1 = document.createTextNode(child.toString());

                h5.appendChild(node1);
                appendToDiv(h5);

                for (var child2 in json[key][child]) {
                    // Create list entry that will hold our link
                    var listElement = document.createElement("li");

                    var link = document.createElement("a");
                    var node2 = document.createTextNode(child2.toString());

                    link.setAttribute('href', json[key][child][child2]); // Add link to relevant resource
                    link.setAttribute('target', '_blank');
                    listElement.setAttribute('style', 'list-style: none'); // Remove bullet point                    
                    link.appendChild(node2);
                    listElement.appendChild(link);
                    appendToDiv(listElement);
                }
                divNum++;
            }
        }
    }
}

function appendToDiv(element) {
    collapsableListDivs[divNum].appendChild(element);
}

// Using Bootstrap collapse functionality
function createBootstrapCard(title, contentId, content) {
    console.log(content);
    var card = document.createElement('div');
    card.setAttribute('class', 'card');

    var cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'card-header');
    cardHeader.setAttribute('id', title);

    var h5 = document.createElement('h5');
    h5.setAttribute('class', 'mb-0');

    var btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-lg btn-block');
    btn.setAttribute('data-toggle', 'collapse');
    btn.setAttribute('data-target', '#' + contentId);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', contentId);
    btn.innerHTML = contentId;

    h5.appendChild(btn);
    cardHeader.appendChild(h5);

    var collapsable = document.createElement('div');
    collapsable.setAttribute('id', contentId);
    collapsable.setAttribute('class', 'collapse show');
    collapsable.setAttribute('aria-labelledby', title);

    var body = document.createElement('div');
    body.setAttribute('class', 'card-body');

    // New element form
    var inputForm = document.createElement('form');
    inputForm.setAttribute('id', title + 'form');
    inputForm.setAttribute('action',
        'https://' + siteUrl + '/Firebase/FirebasePatch?url=' + dbUrl +
        '&category=test&subCategory=test&key=test&value=test');
    inputForm.setAttribute('method', 'PATCH');
    var titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', title + 'TitleInput');
    titleInput.setAttribute('placeholder', 'Title');
    var urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'text');
    urlInput.setAttribute('id', title + 'UrlInput');
    urlInput.setAttribute('placeholder', 'Link');
    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Submit');

    inputForm.appendChild(titleInput);
    inputForm.appendChild(urlInput);
    inputForm.appendChild(submitBtn);

    body.appendChild(inputForm);

    collapsableListDivs.push(body);

    collapsable.appendChild(body);

    card.appendChild(cardHeader);
    card.appendChild(collapsable);

    return card;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}