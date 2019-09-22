// Zoom constants. Define Max, Min, increment and default values
const ZOOM_INCREMENT = 0.2;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.3;
const DEFAULT_ZOOM = 1;

const DEFAULT_AGE_THRESHOLD = 3600000;

function listTabs() {
  browser.storage.sync.get("options").then((options) => {
    getCurrentWindowTabs().then((tabs) => {
      let threshold = options.threshold || DEFAULT_AGE_THRESHOLD
      let currentTime = (new Date).getTime();
    
      let ageThreshold = currentTime - threshold
      let oldTabs = tabs.filter(tab => {
        return tab.lastAccessed < ageThreshold
      })

      let orderedTabs = oldTabs.sort(function(a, b) {
        return a.lastAccessed > b.lastAccessed ? 1 : 0
      })

      let tabsList = document.getElementById('tabs-list');
      let currentTabs = document.createDocumentFragment();
      let limit = 50;
      let counter = 0;

      tabsList.textContent = '';

      for (let tab of orderedTabs) {
        if (!tab.active && counter <= limit) {
          let tabLink = document.createElement('a');

          let age = currentTime - tab.lastAccessed
          let ageDisplay = Math.round((age / 1000)).toString() + "s "
          if (age > 60000){
            ageDisplay = Math.round((age / 1000 / 60)).toString() + "m "
          }
          if (age > 60000 * 60)
          {
              ageDisplay = Math.round((age / 1000 / 60 / 60)).toString() + "h "
          }
          if (age > 60000 * 60 * 24)
          {
              ageDisplay = Math.round((age / 1000 / 60 / 60 / 24)).toString() + " days "
          }
          tabLink.textContent = (tab.title || tab.id) + " " + ageDisplay;
          tabLink.setAttribute('href', tab.id);
          currentTabs.appendChild(tabLink);
      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
  });
});
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", (e) => {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
}

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});
