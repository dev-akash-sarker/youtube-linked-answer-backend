const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/get-video-info", async (req, res) => {
  try {
    const { videoLink, question } = req.body;

    // Extract video information from YouTube API
    const videoInfo = await getVideoInfo(videoLink);
    console.log(videoInfo);

    // Implement your question-answering logic here

    // For now, just return a placeholder answer
    const answer = "this is answer";

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const openai = new OpenAI({
  apiKey: "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", // Replace with your actual OpenAI API key
});

// async function generateAnswer(prompt) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "text-embedding-ada-002", // Use the appropriate engine
//       prompt,
//       max_tokens: 100, // Adjust based on your needs
//     });

//     return response.data.choices[0].text.trim();
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

function convertLongURL(videoLink) {
  // Extract the video ID from the short URL using a regular expression
  const match = videoLink.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractVideoId(videoLink) {
  const videoId = convertLongURL(videoLink);

  if (videoId) {
    const longUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const url = new URL(longUrl);
    return url.searchParams.get("v");
  } else {
    // Handle invalid or unsupported short URLs
    const url = new URL(videoLink);
    return url.searchParams.get("v");
  }
}

// https://youtu.be/0OmRhf3vQAw

async function getVideoInfo(videoLink) {
  try {
    const videoId = extractVideoId(videoLink);
    const apiKey = "AIzaSyAKdsEZ_UtJLF1NdN9ctukIy7UYy_HSR94"; // Replace with your actual YouTube API key
    // console.log("Video ID:", videoId);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );

    console.log("hello world", response);

    // Check if response.data.items is an array and has at least one element
    if (
      response.data.items &&
      response.data.items.length > 0 &&
      response.data.items[0].snippet
    ) {
      const videoInfo = response.data.items[0].snippet;
      return videoInfo;
    } else {
      throw new Error("Invalid or empty response from YouTube API");
    }
  } catch (error) {
    console.error("Error fetching video info:", error);
    throw error; // Propagate the error to the calling function
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
