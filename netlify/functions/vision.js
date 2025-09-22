import vision from "@google-cloud/vision";

export async function handler(event, context) {
  const user = context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Not logged in" }),
    };
  }

  try {
    const { imageBase64 } = JSON.parse(event.body);

    const client = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    });

    // Use textDetection instead of labelDetection
    const [result] = await client.textDetection({ image: { content: imageBase64 } });

    // The recognized text is here:
    const detections = result.textAnnotations; 
    // textAnnotations[0].description usually has the full text

    return {
      statusCode: 200,
      body: JSON.stringify(detections),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
