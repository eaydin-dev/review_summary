
const OPENAI_SECRET = '';

function getSystemPrompt() {
  let promptLines = [
    `You are an expert product reviewer. Your main task is to read, understand and make a conclusion of a review for a product.`,
    `You will be given a number of product reviews done by a purchased person. The review's language will be Turkish for the most cases, but it might be other languages as well.`,
    `You will first eliminate any non-meaningful reviews (for example, if the review is about price or packaging or delivery status/time, you will ignore it).`,
    `Then, use meaningful reviews to summarize and generate key features that reviewers most liked, disliked, satisfied or not satisfied.`,
    ``,
    `Your goal is to generate an overall review of the product. One can read your result and decide if they should buy the product or not.`,
    ``,
    `Your input will be a JSON object like this:`,
    getSampleForPrompt(),
    ``,
    `The ratings are from 1 to 5.`,
    `"ratingCounts" field shows how many users rated for a rating.`,
    `"reviews" field holds the actual reviews with its rating, comment and how many times this review was liked by other users.`,
    `You can consider a review with higher like count to be more prominent.`,
    ``,
    `Your output will be in the following format:`,
    `Neleri beğenildi: {What exactly was liked about this product? Do not include any non-meaningful reviews like price, packaging, delivery status/time}`,
    `Neleri beğenilmedi: {What exactly was not liked about this product? Do not include any non-meaningful reviews like price, packaging, delivery status/time}`,
    `Özet: {Put your overall review here. Keep it at max 5 sentences}`
  ];

  return promptLines.join('\n');
}

function getSampleForPrompt() {
  return JSON.stringify({
    "ratingCounts": [
      {
        "rate": 5,
        "count": 26399,
        "commentCount": 17401
      },
      {
        "rate": 4,
        "count": 4025,
        "commentCount": 2860
      },
      {
        "rate": 3,
        "count": 2090,
        "commentCount": 1562
      },
      {
        "rate": 2,
        "count": 688,
        "commentCount": 566
      },
      {
        "rate": 1,
        "count": 949,
        "commentCount": 756
      }
    ],
    "reviews": [
      {
        "rate": 5,
        "comment": "Bayıldığım ve bol bol stokladığım bir ürün.",
        "reviewLikeCount": 1
      },
      {
        "rate": 3,
        "comment": "İndirime girince stok yapıyorum",
        "reviewLikeCount": 7
      },
      {
        "rate": 5,
        "commentTitle": "",
        "comment": "her zaman kullandığım koku stok yapıyorum",
        "reviewLikeCount": 0
      }
    ]
  });
}

async function getSummary(ratingCounts, reviews) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_SECRET}`
    },
    method: "POST",
    body: JSON.stringify({ 
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "text": getSystemPrompt(),
              "type": "text"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "text": JSON.stringify({ratingCounts, reviews}),
              "type": "text"
            }
          ]
        },
      ],
      "temperature": 1,
      "max_tokens": 5085,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    }),
  });

  let responseJson = await response.json();
  return responseJson;
}