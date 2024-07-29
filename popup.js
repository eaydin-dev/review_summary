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
  try {
    let {reviews} = await getAllReviewsTy(url);
    let summaryResponse = await getSummary(reviews);
    processSummary(summaryResponse);
    hideLoading();
  } catch (error) {
    console.error(error);
    displayError();
  }

}

function processSummary(summaryResponse) {
  let summary = summaryResponse.choices[0].message.content.replace('\n', '<br/> <br/>');
  // return summary;
  document.getElementById('summary').innerHTML = summary;


  // let summaryLines = summary.split('\n');
  // let summaryText = summaryLines.slice(1, summaryLines.length - 1).join('\n');
  // return summaryText;
}

