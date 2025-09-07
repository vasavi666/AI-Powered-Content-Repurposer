 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Repurpose route with AI
app.post("/api/repurpose", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "No content provided" });
  }

  try {
    // Generate LinkedIn Post
    const linkedinRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an assistant that creates social media posts." },
        { role: "user", content: `Turn this blog into a professional LinkedIn post:\n\n${content}` },
      ],
    });

    // Generate Twitter Thread
    const twitterRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Summarize this into a Twitter thread (use multiple tweets):\n\n${content}` },
      ],
    });

    // Generate Instagram Caption
    const instaRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Make a short, catchy Instagram caption with hashtags:\n\n${content}` },
      ],
    });

    // Generate YouTube Script
    const ytRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Convert this into a short engaging YouTube script intro:\n\n${content}` },
      ],
    });

    res.json({
      linkedin: linkedinRes.choices[0].message.content,
      twitter: twitterRes.choices[0].message.content,
      instagram: instaRes.choices[0].message.content,
      youtube: ytRes.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
