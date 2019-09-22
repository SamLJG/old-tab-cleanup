function saveOptions(e) {
    e.preventDefault();
    setThreshold(
        document.querySelector('#tab-age-threshold-option').value
    )
}

function setThreshold(threshold) {
    if (Number.isInteger(threshold) === false) {
        return;
    }

    browser.storage.sync.set({
        threshold: threshold
    });
}

function restoreOptions(){
    function setCurrentThreshold(result){
        document
            .getElementById("tab-age-threshold-option")
            .innerText = result.threshold || "3600000";
    }

    browser.storage.sync.get("threshold").then(setCurrentThreshold);
}
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);