let htmlPassthroughKeys = document.getElementById("passthroughKeys")
let htmlIgnoredKeys = document.getElementById("ignoredKeys")
let globalStore = {}

// When the button is clicked, inject setPageBackgroundColor into current page
toggleLogging.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("swagswga")

  chrome.storage.sync.get().then((store) => {
    console.log(store);
    chrome.storage.sync.set({...store, isLogging: !store.isLogging});
    console.log("Toggled from", store);
  })
});


function updateIgnored(ignored) {
  while (ignoredKeys.firstChild) {
    ignoredKeys.removeChild(ignoredKeys.firstChild);
  }

  ignored.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item;
    let button = document.createElement("deletebutton");
    button.innerText = "delete"
    button.addEventListener("click", () => deleteIgnored(item))
    li.appendChild(button);
    htmlIgnoredKeys.appendChild(li);
  });

}

/** @Param {string[]} passthrough */
function updatePassthrough(passthrough) {
  while (htmlPassthroughKeys.firstChild) {
    htmlPassthroughKeys.removeChild(htmlPassthroughKeys.firstChild);
  }

  passthrough.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item;
    let button = document.createElement("deletebutton");
    button.innerText = "delete"
    button.addEventListener("click", () => deletePassthrough(item))
    li.appendChild(button);
    htmlPassthroughKeys.appendChild(li);  
  });
}

console.log("getting storage", htmlPassthroughKeys)

chrome.storage.sync.get().then((store) => {
  console.log(store)

  updatePassthrough(store.passthroughKeys);
  updateIgnored(store.ignoredKeys);

  globalStore = store
  toggleLogging.textContent = `logging: ${store.isLogging}`

})

chrome.storage.onChanged.addListener((changes) => {
  console.log("changes: ", changes)
 
  if ("passthroughKeys" in changes) {
    updatePassthrough(changes.passthroughKeys.newValue)
    globalStore = {...globalStore, passthroughKeys: changes.passthroughKeys.newValue}

  }
  if ("ignoredKeys" in changes) {
    updateIgnored(changes.ignoredKeys.newValue)
    globalStore = {...globalStore, ignoredKeys: changes.ignoredKeys.newValue}
  }
  if ("isLogging" in changes) {
    toggleLogging.textContent = `logging: ${changes.isLogging.newValue}`
    globalStore = {...globalStore, isLogging: changes.isLogging.newValue}
  }
})


passthroughKeysInput.addEventListener("keyup", (ev) => {
  console.log("pass-input", ev)
  console.log(ev.value)
  if (ev.key != "Enter") {
    return
  }
  globalStore.passthroughKeys.push(passthroughKeysInput.value)
  passthroughKeysInput.value = ""

  chrome.storage.sync.set(globalStore)
})

ignoredKeysInput.addEventListener("keyup", (ev) => {
  console.log("pass-input", ev)
  console.log(ev.value)
  if (ev.key != "Enter") {
    return
  }

  globalStore.ignoredKeys.push(ignoredKeysInput.value)
  ignoredKeysInput.value = ""
  chrome.storage.sync.set(globalStore)
})


function deleteIgnored(word) {
  let newList = globalStore.ignoredKeys.filter((elem) => elem != word);
  globalStore = {...globalStore, ignoredKeys: newList};
  console.log("deleting word", word, newList.length, globalStore);
  chrome.storage.sync.set(globalStore);
}

function deletePassthrough(word) {
  let newList = globalStore.passthroughKeys.filter((elem) => elem != word);
  globalStore = {...globalStore, passthroughKeys: newList};
  console.log("deleting word", word, newList.length, globalStore);
  chrome.storage.sync.set(globalStore);
}