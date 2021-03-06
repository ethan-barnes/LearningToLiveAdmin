var collapsableListDivs = [];
var divNum = 0;
var siteUrl = window.location.host;
var dbUrl;
var currentCountry;
var signedIn;

function FirebaseDelete(category, subCategory, key) {
    if (confirm("Are you sure you want to delete " + key + "?")) {
        $.ajax({
            url: 'https://' + siteUrl + '/Firebase/FirebaseDelete?url='
                + dbUrl + '&category=' + category +
                '&subCategory=' + subCategory +
                '&key=' + key,
            success: function (data) {
                console.log("success: ");
                console.log(data);
                FirebaseGet(currentCountry, signedIn); // updates lists
            },
            error: function (xhr) {
                alert("Error writing to firebase");
                console.log(xhr);
                FirebaseGet(currentCountry, signedIn); // updates lists
            }
        });
    }
}

function FirebasePatch(category, subCategory, key, value) {
    $.ajax({
        url: 'https://' + siteUrl + '/Firebase/FirebasePatch?url='
            + dbUrl + '&category=' + category +
            '&subCategory=' + subCategory +
            '&key=' + key +
            '&value=' + value,
        success: function (data) {
            console.log("success: ");
            console.log(data);
            FirebaseGet(currentCountry, signedIn); // updates lists
        },
        error: function (xhr) {
            alert("Error writing to firebase");
            console.log(xhr);
            FirebaseGet(currentCountry, signedIn); // updates lists
        }
    });
}

function FirebaseGet(country, isSignedIn) {
    signedIn = isSignedIn;
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
    divNum = 0;
    collapsableListDivs = [];

    var json = JSON.parse(fbData);
    console.log(json);

    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            if (json[key].hasOwnProperty('headings')) {
                // Create heading for each key in database
                var h3 = document.createElement("h3");
                var node = document.createTextNode(capitaliseFirstLetter(key));
                h3.appendChild(node);

                document.getElementById("accordion").appendChild(createBootstrapCard(key + 'Heading', json[key]["name"]));
                if (!signedIn) {
                    $('.collapse').collapse();
                }
            }
        }
    }
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            if (json[key].hasOwnProperty('headings')) {
                for (var child2 in json[key]['headings']) {
                    // Create heading for children of key
                    var name = json[key]['headings'][child2]['name'];
                    var id = json[key]['headings'][child2]['id'];

                    var h5 = document.createElement("h5");
                    h5.setAttribute('id', name + 'SubCat');
                    var node1 = document.createTextNode(name);

                    // Only display empty headings to signed in user
                    if (json[key][id] != undefined || signedIn) {
                        h5.appendChild(node1);
                        appendToDiv(h5);
                    }

                    //name = name.replace(/\s+/g, ''); // remove whitespace
                    if (signedIn) createForm(key, id, h5);

                    // Create list entry that will hold our link                    
                    for (var linkId in json[key][id]) {
                        var listElement = document.createElement("li");

                        var link = document.createElement("a");
                        var node2 = document.createTextNode(linkId.toString());

                        link.setAttribute('href', json[key][id][linkId]); // Add link to relevant resource
                        link.setAttribute('target', '_blank');
                        link.setAttribute('style', 'padding-right: 1%;');
                        listElement.setAttribute('style', 'list-style: none;');
                        link.appendChild(node2);
                        listElement.appendChild(link);
                        if (signedIn) listElement.appendChild(createDeleteButton(key, id, linkId.toString()));

                        appendToDiv(listElement);
                    }
                }
                divNum++;
            }
        }
    }
}

function appendToDiv(element) {
    collapsableListDivs[divNum].appendChild(element);
}

function updateFirebase(category, subCatId, titleId, urlId) {
    var title = document.getElementById(titleId).value;
    var url = document.getElementById(urlId).value;
    FirebasePatch(category, subCatId, title, url);
}

function createDeleteButton(category, subCategory, key) {
    var trashIcon = document.createElement('i');
    trashIcon.setAttribute('class', 'fa fa-trash-o');

    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('class', 'btn btn-outline-danger btn-sm')
    deleteBtn.appendChild(trashIcon);
    deleteBtn.onclick = function () { FirebaseDelete(category, subCategory, key) };
    return deleteBtn;
}

function createForm(title, content, heading) {
    var titleId = content + 'TitleInput';
    var urlId = content + 'UrlInput';
    var subCat = content;
    var collapseId = content + 'Card';

    var plusIcon = document.createElement('i');
    plusIcon.setAttribute('class', 'fa fa-plus');
    var addButton = document.createElement('button');
    addButton.setAttribute('type', 'button');
    addButton.setAttribute('class', 'btn btn-sm');
    addButton.setAttribute('data-toggle', 'collapse');
    addButton.setAttribute('data-target', '#' + collapseId);
    addButton.setAttribute('aria-expanded', 'false');
    addButton.setAttribute('aria-controls', collapseId);
    addButton.appendChild(plusIcon);

    var collapse = document.createElement('div');
    collapse.setAttribute('class', 'collapse');
    collapse.setAttribute('id', collapseId);
    var formCard = document.createElement('div');
    formCard.setAttribute('class', 'card card-body');
    collapse.appendChild(formCard);

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

    heading.appendChild(addButton);
    inputForm.appendChild(submitBtn);
    formCard.appendChild(inputForm);
    heading.appendChild(collapse);
}

// Using Bootstrap collapse functionality
function createBootstrapCard(title, contentId) {
    var contentIdNoWhitespace = contentId.replace(/\s+/g, ''); // remove whitespace to make cards collapse
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
    btn.setAttribute('data-target', '#' + contentIdNoWhitespace);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', contentIdNoWhitespace);
    btn.innerHTML = contentId;

    h5.appendChild(btn);
    cardHeader.appendChild(h5);

    var collapsable = document.createElement('div');
    collapsable.setAttribute('id', contentIdNoWhitespace);
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