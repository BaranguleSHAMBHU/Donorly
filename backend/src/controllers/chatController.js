import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handleChat = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    const reply = response.output_text;

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "AI service unavailable" });
  }
};
