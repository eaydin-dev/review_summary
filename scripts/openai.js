async function getSummary(reviews) {
  const response = await fetch(
    "https://review-summary-be-cc3b40ae5924.herokuapp.com/ai/",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        reviews,
        language: getLanguage(),
      }),
    }
  );

  let responseJson = await response.json();
  return responseJson;
}
