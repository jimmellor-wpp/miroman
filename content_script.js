var csreq = new XMLHttpRequest();
var baseUrl = `https://miro.com/api/v1/organizations/${miroCompanyId}/members`;

var userList = "";

function CSVToArray( strData, strDelimiter ){
  strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );
  var arrData = [[]];
  var arrMatches = null;

  while (arrMatches = objPattern.exec( strData )){
      var strMatchedDelimiter = arrMatches[ 1 ];
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){
          arrData.push( [] );
      }
      var strMatchedValue;
      if (arrMatches[ 2 ]){
          strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );
      } else {
          strMatchedValue = arrMatches[ 3 ];
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }
  return( arrData );
}


var fileChooser = document.createElement("input");
fileChooser.type = 'file';

fileChooser.addEventListener('change', function (evt) {
  var f = evt.target.files[0];
  if(f) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;

      userList = CSVToArray(contents);
      membersObject =[]

      userList.forEach(item => membersObject.push({"email": item[0]}));

      var userPayLoad = {
        "license": "FREE_RESTRICTED",
        "membersOperation": "UPDATE",
        "members": membersObject
      };
      console.log(JSON.stringify(userPayLoad));

      csreq.open("PATCH", baseUrl, true);
      csreq.setRequestHeader("Content-type", "application/json");
      csreq.setRequestHeader("x-csrf-token", miroCSRFTok);
      csreq.send(JSON.stringify(userPayLoad))
      csreq.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert(`Changed ${membersObject.length} accounts to 'Free Restricted'. Check the console for details.`);
        console.log(`Changed ${membersObject.length} accounts to 'Free Restricted':`);
        membersObject.forEach(item => console.log(item.email));
    }
}

    }
    reader.readAsText(f);
  }
});

document.body.appendChild(fileChooser);
fileChooser.click();