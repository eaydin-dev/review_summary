async function getAllReviewsTy(url) {
  let reviews = [];

  for (let i = 1; i <= 5; i++) {
    let r = await getReviewsTy(url, i);
    reviews = reviews.concat(r);
  }

  return {reviews};
}

async function getReviewsTy(url, rates = 5) {
  let reviewUrl = getReviewsUrlTy(url, rates);
  let response = await fetch(reviewUrl)
    .then((res) => res.json());
  if (!response.isSuccess || !response.result) {
    console.error('error');
    return [];
  }
  let productReviews = response.result?.productReviews;
  return mapReviewsTy(productReviews?.content ?? []); 
}

function getReviewsUrlTy(url, rates) {
  let urlArray = url.split('?');
  if (!urlArray || urlArray.length < 1) {
    return null;
  }
  if (!urlArray[0].includes('-')) {
    return null;
  }
  
  let contentId = urlArray[0].split('-')?.pop();
  if (!contentId || contentId.length < 5 || !contentId.length > 10) {
    return null;
  }
  let reviewUrl = `https://cors-ea-749769a277fd.herokuapp.com/https://public-mdc.trendyol.com/discovery-web-websfxsocialreviewrating-santral/product-reviews-detailed?contentId=${contentId}&page=0&order=DESC&orderBy=Score&rates=${rates}&channelId=1`;
  return reviewUrl;
}

function mapReviewsTy(reviews) {
  return reviews.map((review) => {
    return {
      rate: review.rate,
      comment: review.comment,
      reviewLikeCount: review.reviewLikeCount,
    };
  });
}