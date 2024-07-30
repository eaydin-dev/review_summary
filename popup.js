initUI();
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

document.getElementById('donate_button').addEventListener('click', async () => {
  chrome.tabs.create({ url: 'https://kreosus.com/eaydin' });
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
  document.getElementById('summary').innerHTML = summary;
}

