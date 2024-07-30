initUI();
validateUrl();

document.getElementById("get_summary").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.url?.includes("https://www.trendyol.com")) {
      displayLoading();
      runTrendyol(tabs[0]?.url);
    } else {
      writeNotValidUrl();
    }
  });
});

document.getElementById("donate_button").addEventListener("click", async () => {
  chrome.tabs.create({ url: "https://kreosus.com/eaydin" });
});

async function runTrendyol(url) {
  try {
    let { reviews } = await getAllReviewsTy(url);
    let summaryResponse = await getSummary(reviews);
    processSummary(summaryResponse);
    hideLoading();
  } catch (error) {
    console.error(error);
    displayError();
  }
}

function processSummary(summaryResponse) {
  let summary = summaryResponse.choices[0].message.content;
  let summaryLines = summary
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      let lineTrim = line.trim();
      if (lineTrim.startsWith("1- ")) {
        return `<b>${chrome.i18n.getMessage(
          "whatWasLiked"
        )}</b>: ${lineTrim.replace("1- ", "")}`;
      } else if (lineTrim.startsWith("2- ")) {
        return `<b>${chrome.i18n.getMessage(
          "whatWasNotLiked"
        )}</b>: ${lineTrim.replace("2- ", "")}`;
      } else if (lineTrim.startsWith("3- ")) {
        return `<b>${chrome.i18n.getMessage(
          "overallReview"
        )}</b>: ${lineTrim.replace("3- ", "")}`;
      } else {
        return lineTrim;
      }
    });

  document.getElementById("summary").innerHTML = summaryLines.join("<br/> <br/>");
}
