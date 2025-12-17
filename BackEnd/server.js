import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5174;

app.use(cors());
app.use(express.json());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-questions", async (req, res) => {
  try {
    const { summaryText } = req.body;

    if (!summaryText) {
      return res.status(400).json({ error: "No summary text provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
    ${summaryText}

    make questions in hebrew based on the text above. 
    Make as many questions as needed to cover the text well. 
    Also write 4 options for each question and mark the correct answer.
    Return in JSON format like this and only this, don't type any other text except the JSON:
    [
      {
        "question": "question here",
        "options": ["option1", "option2", "option3", "option4"],
        "answer": "right option here"
      }
    ]
    `;

    console.log("Sending request to Gemini via Library...");

    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini raw text response:", text);

    const cleanedText = text.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(cleanedText);

    res.json({ questions });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ 
      error: "Error generating questions", 
      details: err.message,
      questions: [] 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

