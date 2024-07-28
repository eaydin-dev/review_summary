
document.getElementById('get_summary').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log('lulw');
    console.log(tabs[0].url);
    if (tabs[0].url.includes('https://www.trendyol.com/')) {
      runTrendyol(tabs[0]?.url);
    }
  });
});

async function runTrendyol(url) {
  let {ratingCounts, reviews} = await getAllReviewsTy(url);
  let summaryResponse = await getSummary(ratingCounts, reviews);
  processSummary(summaryResponse);
  console.log(summaryResponse);
}

function processSummary(summaryResponse) {
  document.getElementById('summary').innerHTML = JSON.stringify(summaryResponse);
  // let summary = summaryResponse.choices[0].message.content;
  // return summary;

  // let summaryLines = summary.split('\n');
  // let summaryText = summaryLines.slice(1, summaryLines.length - 1).join('\n');
  // return summaryText;
}