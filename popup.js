document.getElementById('title').textContent = chrome.i18n.getMessage("extName");
document.getElementById('get_summary').textContent = chrome.i18n.getMessage("getSummary");
validateUrl();

document.getElementById('get_summary').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.url?.includes('https://www.trendyol.com')) {
      displayLoading();
      runTrendyol(tabs[0]?.url);
    } else {
      writeNotValidUrl();
    }
  });
});

async function runTrendyol(url) {
  let {ratingCounts, reviews} = await getAllReviewsTy(url);
  let summaryResponse = await getSummary(ratingCounts, reviews);
  processSummary(summaryResponse);
  hideLoading();
}

function processSummary(summaryResponse) {
  let summary = summaryResponse.choices[0].message.content;
  // return summary;
  document.getElementById('summary').innerHTML = summary;


  // let summaryLines = summary.split('\n');
  // let summaryText = summaryLines.slice(1, summaryLines.length - 1).join('\n');
  // return summaryText;
}

function displayLoading() {
  document.getElementById('get_summary').disabled = true;
  document.getElementById('get_summary').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + chrome.i18n.getMessage("loading");
}

function hideLoading() {
  document.getElementById('get_summary').disabled = false;
  document.getElementById('get_summary').innerHTML = chrome.i18n.getMessage("getSummary");
}

function writeNotValidUrl() {
  document.getElementById('get_summary').disabled = true;
  document.getElementById('summary').innerHTML = chrome.i18n.getMessage("notValidUrl");
}

function validateUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = tabs[0]?.url;
    if (!url || !url.includes('?')) {
      writeNotValidUrl();
      return;
    }
    console.log('lulw', url);
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