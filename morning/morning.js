import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateMessage() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: "Give me a short, uplifting, unique good morning message." }]
      }
    ]
  });

  return result.response.text();
}

async function run() {
  const msg = await generateMessage();
  console.log("AI Good Morning Message:", msg);
}

run();
