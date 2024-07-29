async function getAllReviewsTy(url) {
  let reviewUrl = getReviewsUrlTy(url);

  let response = await fetch(reviewUrl)
    .then((res) => res.json());
  if (!response.isSuccess || !response.result) {
    console.error('error');
    return;
  }
  let ratingCounts = response.result?.contentSummary?.ratingCounts ?? [];
  let productReviews = response.result?.productReviews;
  let totalPages = productReviews?.totalPages ?? 0;
  let reviews = mapReviewsTy(productReviews?.content ?? []);

  totalPages = totalPages > 5 ? 3 : totalPages;
  for (let i = 1; i <= totalPages; i++) {
    let r = await getReviewsTy(url, i);
    reviews = reviews.concat(r);
  }

  console.log('reviews');
  console.log(reviews);
  return {ratingCounts, reviews};
}


async function getReviewsTy(url, page = 0) {
  let reviewUrl = getReviewsUrlTy(url, page);
  let response = await fetch(reviewUrl)
    .then((res) => res.json());
  if (!response.isSuccess || !response.result) {
    console.error('error');
    return [];
  }
  let productReviews = response.result?.productReviews;
  return mapReviewsTy(productReviews?.content ?? []); 
}

function getReviewsUrlTy(url, page = 0) {
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
  let reviewUrl = `https://justcors.com/tl_6bbc215/https://public-mdc.trendyol.com/discovery-web-websfxsocialreviewrating-santral/product-reviews-detailed?contentId=${contentId}&page=${page}&order=DESC&orderBy=Score&channelId=1`;
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