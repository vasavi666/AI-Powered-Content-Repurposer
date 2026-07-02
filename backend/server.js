 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-powered-content-repurposer-v3yn.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Repurpose route
app.post("/api/repurpose", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "No content provided",
    });
  }

  try {
    // LinkedIn
    const linkedinRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an assistant that creates social media posts.",
        },
        {
          role: "user",
          content: `Turn this blog into a professional LinkedIn post:\n\n${content}`,
        },
      ],
    });

    // Twitter
    const twitterRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize this into a Twitter thread:\n\n${content}`,
        },
      ],
    });

    // Instagram
    const instaRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create an Instagram caption with hashtags:\n\n${content}`,
        },
      ],
    });

    // YouTube
    const ytRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Convert this into a YouTube intro script:\n\n${content}`,
        },
      ],
    });

    res.json({
      linkedin: linkedinRes.choices[0].message.content,
      twitter: twitterRes.choices[0].message.content,
      instagram: instaRes.choices[0].message.content,
      youtube: ytRes.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      error: "Failed to generate content",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
