// setTimeout(() => {


//     console.log("i am content wooo!")
//     var element = document.getElementById('movie_player'); // Not actual selector
//     element.classList.remove("ytp-autohide");
//     console.log("sendnig ", element)
//     // chrome.runtime.sendMessage({
//     //   html:    element, 
//     //   service: 'gmail'
//     // }, function (response) {
//     // });
    
//     console.log("message sent!")
    
// }, 10000)

/*
ytb-autohide?
id: "movie_player"
*/

// ==UserScript==
// @name         YouTube Always show progress bar
// @version      0.2
// @description  Always show progress bar
// @author       Workgroups
// @match        *://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/127290
// ==/UserScript==
 
function findVideoInterval() {
    console.log("repeating")
    var ytplayer = document.querySelector(".html5-video-player");
    var video = ytplayer.querySelector("video");
    var progressbar = ytplayer.querySelector(".ytp-play-progress");
    var loadbar = ytplayer.querySelector(".ytp-load-progress");
    if (!video || !progressbar || !loadbar) {
        return;
    }
    console.log(video.currentTime)
};


ignoredKeys = []
passthroughKeys = [""]
isLogging = false
chrome.storage.sync.get().then((store) => {
    passthroughKeys = store.passthroughKeys;
    ignoredKeys = store.ignoredKeys;
    isLogging = store.isLogging;
})

chrome.storage.onChanged.addListener((changes) => {
    if ("passthroughKeys" in store) {
        passthroughKeys = changes.passthroughKeys.newValue;
    }
    if ("ignoredKeys" in changes) {
        ignoredKeys = changes.ignoredKeys.newValue;
    }
    if ("isLogging" in changes) {
        isLogging = changes.isLogging.newValue;
    }
})

document.addEventListener("keydown", (ev) => {
    if (!isLogging) {
        return
    }
    
    console.log("Passthrough?: ", ev.key, passthroughKeys.indexOf(ev.key) > 0);
    

    if (passthroughKeys.indexOf(ev.key) > 0) {
        ev.stopImmediatePropagation()
        ev.stopPropagation()
        ev.preventDefault()
        return
    }

    console.log("ignored?: ", ignoredKeys.indexOf(ev.key) > 0);
    if (ignoredKeys.indexOf(ev.key) > 0) {
        return
    }
    
    let title = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer").innerText;
    var ytplayer = document.querySelector(".html5-video-player");
    var video = ytplayer.querySelector("video");
    var progressbar = ytplayer.querySelector(".ytp-play-progress");
    var loadbar = ytplayer.querySelector(".ytp-load-progress");
    if (!video || !progressbar || !loadbar) {
        console.log("WARNING SOMETHING WENT WRONG! No video/progressbar/loadbar")
        return;
    }
    console.log("pressed key: ", ev.key, video.currentTime);

    chrome.runtime.sendMessage({title: title, time: video.currentTime, key: ev.key})

}, {capture: true})
