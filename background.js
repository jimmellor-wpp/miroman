var miroCSRFTok = "";

function importFile() {
    var urlRegex = /https:\/\/miro.com\/app\/settings\/company\/(\d+)/;

    if (miroCSRFTok != "") {
      console.log("got the x-csrf-token: " + miroCSRFTok);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var miroCompanyId = tabs[0].url.match(urlRegex)[1];
      // alert(`company id = ${miroCompanyId}`)

      chrome.tabs.executeScript(tabs[0].id, {
        code: `var miroCSRFTok = '${miroCSRFTok}'; var miroCompanyId = '${miroCompanyId}';`
      }, function() {
        chrome.tabs.executeScript(tabs[0].id, {file: 'content_script.js'});
      });
    });
    } else {
      console.log("No CSRF token yet. Please wait until the extension icon shows a 'OK!' badge.")
    }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name == "X-CSRF-TOKEN") {
        miroCSRFTok = details.requestHeaders[i].value;
        console.log('got X-CSRF-TOKEN', details.requestHeaders[i].value);
        chrome.browserAction.setBadgeText({text: 'OK!'})
      }
    }
    return {requestHeaders: details.requestHeaders};
  },
  // filters
  {urls: ['https://miro.com/*']},
  // extraInfoSpec
  ['requestHeaders']);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) { importFile() });
