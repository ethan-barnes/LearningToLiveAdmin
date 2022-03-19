﻿var collapsableListDivs = [];
var divNum = 0;
var siteUrl = window.location.host;
var dbUrl;
var currentCountry;

function FirebasePatch(category, subCategory, key, value) {
    console.log("firebase send");
    $.ajax({
        url: 'https://' + siteUrl + '/Firebase/FirebasePatch?url='
            + dbUrl + '&category=' + category +
            '&subCategory=' + subCategory +
            '&key=' + key +
            '&value=' + value,
        success: function (data) {
            console.log("success: ");
            console.log(data);
            FirebaseGet(currentCountry); // updates lists
        },
        error: function (xhr) {
            alert("Error writing to firebase");
            console.log(xhr);
            FirebaseGet(currentCountry); // updates lists
        }
    });
}

function FirebaseGet(country) {
    currentCountry = country;
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

            document.getElementById("accordion").appendChild(createBootstrapCard(key + 'Heading', capitaliseFirstLetter(key)));
        }
    }
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            for (var child in json[key]) {
                // Create heading for children of key
                var h5 = document.createElement("h5");
                h5.setAttribute('id', child + 'SubCat');
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
                createForm(key + 'Heading', child, h5);
            }
            divNum++;
        }
    }
}

function appendToDiv(element) {
    collapsableListDivs[divNum].appendChild(element);
}

function updateFirebase(categoryId, subCatId, titleId, urlId) {
    var category = document.getElementById(categoryId).innerText;
    var subCat = document.getElementById(subCatId).innerText;
    var title = document.getElementById(titleId).value;
    var url = document.getElementById(urlId).value;
    FirebasePatch(category, subCat, title, url);
}

function createForm(title, content, heading) {
    // New element form
    var titleId = content + 'TitleInput';
    var urlId = content + 'UrlInput';
    var subCat = content + 'SubCat';

    var titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', titleId);
    titleInput.setAttribute('placeholder', 'Title');

    var urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'text');
    urlInput.setAttribute('id', urlId);
    urlInput.setAttribute('placeholder', 'Link');

    var inputForm = document.createElement('form');
    inputForm.appendChild(titleInput);
    inputForm.appendChild(urlInput);
    inputForm.setAttribute('id', content + 'form');

    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'button');
    submitBtn.setAttribute('value', 'Submit');
    submitBtn.onclick = function () { updateFirebase(title, subCat, titleId, urlId) };

    inputForm.appendChild(submitBtn);
    heading.appendChild(inputForm);
}

// Using Bootstrap collapse functionality
function createBootstrapCard(title, contentId) {
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

    collapsableListDivs.push(body);

    collapsable.appendChild(body);

    card.appendChild(cardHeader);
    card.appendChild(collapsable);

    return card;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}