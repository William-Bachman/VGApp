//noSQL database
var firebaseURL = 'https://videogame.firebaseio.com/'
//objConstructor
var vgCharacter = function (Platform, Name, Story) {
    this.Platform = Platform;
    this.Name = Name;
    this.Story = Story;
}
//Just for fun on the prototype
vgCharacter.prototype = function () {
    alert("People who own" + this.Platform + "have enjoyed" + this.Name);
}

//vgCharacter array
var vgCharacters = [];

//sends characters to div and firebase
var sendVGCharacter = function () {
    var Platform = $('#inputSystem').val();
    var Name = $('#inputName').val();
    var Story = $('#inputStory').val();
    var myCharacter = new vgCharacter(Platform, Name, Story);
    postVGCharacter(myCharacter);
    //clears out the inputs
    $('#inputSystem').val('');
    $('#inputName').val('');
    $('#inputStory').val('');

}
//prints vg characters to the HTML
var printVGcharacters = function () {
    $('#displayVGcharacters').html = ('');
    var elemString = '';
    for (var i = 0; i < vgCharacters.length; i++) {
        elemString += '<h2>' + vgCharacters[i].Platform + '</h2>'
        elemString += '<h3>' + vgCharacters[i].Name + '</h3>'
        elemString += '<h4>' + vgCharacters[i].Story + '</h4>'
        elemString += '<button class="btn btn-warning" onclick="editVGCharacter(' + i + ')">Edit Info</button><button class="btn btn-warning" onclick="deleteVGCharacter(' + i + ')">Delete</button>'
    }
    $('#displayVGcharacters').html(elemString);
}
//Posts data from the inputs to the firebase
var postVGCharacter = function (sendVGCharacter) {
    var request = new XMLHttpRequest();
    request.open('POST', firebaseURL + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            sendVGCharacter.key = response.name
            vgCharacters.push(sendVGCharacter);
            printVGcharacters();

        }
        else {
            console.log(this.response);
        }
    }
    request.send(JSON.stringify(sendVGCharacter));

}


//this is the normal get call
var getVGCharacters = function () {
    var request = new XMLHttpRequest()
    request.open('GET', firebaseURL + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            for (var propName in response) {
                response[propName].key = propName;
                vgCharacters.push(response[propName]);
            }
           
            printVGcharacters();
        }
        else {
            console.log(this.response);
           
        }
    }
    request.send();
    
   
}

//enable the modal to trigger for allowing edits of the innerHTML objects
var editVGCharacter = function (i) {
    $('#editPlatform').val(vgCharacters[i].Platform);
    $('#editName').val(vgCharacters[i].Name);
    $('#editStory').val(vgCharacters[i].Story);
    $('#SaveEditButton').html('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveEdit(' + i + ');">Save changes</button>')
    $('#myModal1').modal('toggle');
}
//Puts the updated information into firebase
var putVGCharacter = function (data, i) {
    var request = new XMLHttpRequest();
    var key = vgCharacters[i].key;
    request.open('PUT', firebaseURL + key + '/.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            data.key = vgCharacters[i].key;
            vgCharacters.splice(i, 1, data);
            printVGcharacters();
        }
        else {
            console.error(this.response);
        }
    }
    request.send(JSON.stringify(data));
}
//Saves the edited information into the HTML
var saveEdit = function (i) {
    var Platform = $('#editPlatform').val();
    var Name = $('#editName').val();
    var Story = $('#editStory').val();
    var myCharacter = new vgCharacter(Platform, Name, Story);
    putVGCharacter(myCharacter, i);
}
//deletes the information out of the firebase
var deleteVGCharacter = function (i) {
    var request = new XMLHttpRequest();
    request.open('DELETE', firebaseURL + vgCharacters[i].key + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            vgCharacters.splice(i, 1);
            printVGcharacters();


        }
        else {
            console.error(this.response);
        }

    }
    request.send();
}
// This adds the reverse option to the string prototype (primative value)
String.prototype.reverse = function () {
//split turns the string into an array of characters, reverse reverses these characters, join joins them back together in reverse order.
    
     this.split("").reverse().join("");
}
//this is the polling get call
var getVGCharacters2 = function () {
    var request = new XMLHttpRequest()
    setTimeout(getVGCharacters2, 3000);
    request.open('GET', firebaseURL + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            
            }

        
        else {
            console.log(this.response);
            clearTimeout(getvgCharacters2);
        }
    }
    request.send();


}

   //this fetches the information from the Database.
getVGCharacters();
//this fires off the polling ajax call.
getVGCharacters2();