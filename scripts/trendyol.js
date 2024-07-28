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

  for (let i = 1; i <= 2; i++) {
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
  let contentId = urlArray[0].split('-')?.pop();
  let reviewUrl = `https://justcors.com/tl_a5bfbe1/https://public-mdc.trendyol.com/discovery-web-websfxsocialreviewrating-santral/product-reviews-detailed?contentId=${contentId}&page=${page}&order=DESC&orderBy=Score&channelId=1`;
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