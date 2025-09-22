import vision from "@google-cloud/vision";

export async function handler(event, context) {
  const user = context.clientContext.user;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Not logged in" }) };
  }

  try {
    const { imageBase64 } = JSON.parse(event.body);

    // Load service account credentials from env var
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const client = new vision.ImageAnnotatorClient({ credentials });

    const [result] = await client.labelDetection({
      image: { content: imageBase64 }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result.labelAnnotations),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
