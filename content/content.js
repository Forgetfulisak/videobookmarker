
// Hacked together from https://greasyfork.org/sv/scripts/30046-youtube-always-show-progress-bar/code
function findVideoInterval() {
    var ytplayer = document.querySelector(".html5-video-player");
    var video = ytplayer.querySelector("video");
    if (!video) {
        return;
    }

    return video.currentTime
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
    console.log("pass", passthroughKeys)
    

    if (passthroughKeys.indexOf(ev.key) < 0) {
        ev.stopImmediatePropagation()
        ev.stopPropagation()
        ev.preventDefault()
    }

    console.log("ignored?: ", ignoredKeys.indexOf(ev.key) > -1);
    console.log("ignoring: ", ignoredKeys)
    if (ignoredKeys.indexOf(ev.key) > -1) {
        return
    }
    
    let title = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer").innerText;

    let time = findVideoInterval()
    if (!time) {
        console.log("Could not read video.currentTime")
        return
    }

    console.log("pressed key: ", ev.key, time);


    chrome.runtime.sendMessage({title: title, time: time, key: ev.key})

}, {capture: true})
