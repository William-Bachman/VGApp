var firebaseURL = 'https://videogame.firebaseio.com/'
var vgCharacter = function (Platform, Name, Story) {
    this.Platform = Platform;
    this.Name = Name;
    this.Story = Story;
}
var vgCharacters = [];

var sendVGCharacter = function () {
    var Platform = $('#inputSystem').val();
    var Name = $('#inputName').val();
    var Story = $('#inputStory').val();
    var myCharacter = new vgCharacter(Platform, Name, Story);
    postVGCharacter(myCharacter);
    $('#inputSystem').val('');
    $('#inputName').val('');
    $('#inputStory').val('');

}
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

var getVGCharacters = function (VGPoll) {
    var request = new XMLHttpRequest();
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
            setTimeout(60000);
        }
    }
    request.send();
   
}
var editVGCharacter = function (i) {
    $('#editPlatform').val(vgCharacters[i].Platform);
    $('#editName').val(vgCharacters[i].Name);
    $('#editStory').val(vgCharacters[i].Story);
    $('#SaveEditButton').html('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveEdit(' + i + ');">Save changes</button>')
    $('#myModal1').modal('toggle');
}

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
var saveEdit = function (i) {
    var Platform = $('#editPlatform').val();
    var Name = $('#editName').val();
    var Story = $('#editStory').val();
    var myCharacter = new vgCharacter(Platform, Name, Story);
    putVGCharacter(myCharacter, i);
}
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
String.prototype.reverse = function () {
    this.split("Reversed String").reverse().join("");
    console.log("I'm a reversed string");
};

var VGPoll = function (){
    $('#displayVGcharacters').val('');
    setInterval(getVGCharacters, 5000);
    
}
VGPoll(getVGCharacters);
getVGCharacters();