// নতুন এবং সঠিক কোড

const Replicate = require("replicate");

exports.handler = async (event) => {
  // শুধু POST অনুরোধ গ্রহণ করা হবে
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // আপনার গোপন API টোকেনটি এখানে ব্যবহৃত হবে
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
        return { statusCode: 400, body: JSON.stringify({ error: "Prompt is required." }) };
    }

    // লক্ষ্য করুন: আমরা এখানে ভার্সন আইডি ছাড়া শুধু মডেলের নাম ব্যবহার করছি
    const output = await replicate.run(
      "meta/meta-llama-3-8b-instruct",
      {
        input: {
          prompt: prompt,
        },
      }
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ completion: output.join("") }),
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from the AI model." }),
    };
  }
};
