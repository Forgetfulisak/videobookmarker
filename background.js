// background.js


let color = '#3aa757';

let defaultStore = {
  // Keys which are passed through to youtube
  passthroughKeys: [" ", "f", 'ArrowRight', "ArrowLeft", ".", ",", "ArrowUp", "ArrowDown", "Shift", "Control", "J"],
  // Keys which are not sent to server
  ignoredKeys: [], 
  isLogging: false,
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(defaultStore);
  console.log('Default background color set to %cgreen', `color: ${color}`);
});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.sync.get().then((store) => {
    console.log(store)
    if (!store.isLogging) {
      console.log("not logging. ignoring request");
      return
    }

    sendPost(request.title, request.time, request.key)

    sendResponse()
  })
});

chrome.storage.onChanged.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("Checking to inject: ", tab.url)
  
  if (!tab.url.match("/.*youtube.com/.*")) {
    return
  }
  console.log("injecting")
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content/content.js']
  });
})


function sendPost(title, time, key) {
  fetch("http://localhost:9393/", {
    method: "POST",
    body: JSON.stringify({
      title: title,
      timestep: time,
      key: key
    }),
    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((resp) => {
    console.log("resp: ", resp)
  })
}