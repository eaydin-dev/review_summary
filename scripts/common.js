function getLanguage() {
  let language = chrome.i18n.getUILanguage();
  if (language === 'en' || language.includes('en-')) {
    return 'en';
  } else if (language === 'tr') {
    return 'tr';
  } else {
    return 'en';
  }
}

function displayError(error = null) {
  if (!error) {
    error = chrome.i18n.getMessage("genericError");
  }
  document.getElementById('get_summary').disabled = true;
  document.getElementById('get_summary').innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + chrome.i18n.getMessage("getSummary");
  document.getElementById('summary').innerHTML = `<p style="color: red;">${error}</p>`;
}

function displayLoading() {
  document.getElementById('get_summary').disabled = true;
  document.getElementById('get_summary').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + chrome.i18n.getMessage("loading");
  document.getElementById('summary').innerHTML = '';
}

function hideLoading(success = true) {
  document.getElementById('get_summary').disabled = false;
  document.getElementById('get_summary').innerHTML = (success ? '<i class="fa-solid fa-check"></i> ' : '') + chrome.i18n.getMessage("getSummary");
}

function writeNotValidUrl() {
  document.getElementById('get_summary').disabled = true;
  document.getElementById('get_summary').innerHTML = chrome.i18n.getMessage("getSummary");
  document.getElementById('summary').innerHTML = chrome.i18n.getMessage("notValidUrl");
}

function validateUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = tabs[0]?.url;
    if (!url || !url.includes('?')) {
      writeNotValidUrl();
      return;
    }
    if (url.includes('https://www.trendyol.com')) {
      let reviewUrl = getReviewsUrlTy(url);
      if (!reviewUrl) {
        writeNotValidUrl();
        return;
      }
    } else {
      writeNotValidUrl();
    }
  });
}