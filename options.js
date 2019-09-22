function saveOptions(e) {
    e.preventDefault();
    setThreshold(
        document.querySelector('#tab-age-threshold-option').value
    )
}

function setThreshold(threshold) {
    let thresholdNumber = Number(threshold)
    if (Number.isInteger(thresholdNumber) === false) {
        console.warn("invalid input: not a number", threshold)
        return;
    }

    browser.storage.sync.set({
        threshold: thresholdNumber
    });
}

function restoreOptions(){
    function setCurrentThreshold(result){
        document
            .getElementById("tab-age-threshold-option")
            .value = result.threshold || DEFAULT_AGE_THRESHOLD;
    }

    browser.storage.sync.get("threshold").then(setCurrentThreshold, setCurrentThreshold);
}
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);