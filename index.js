const express = require("express");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { video_url, start_time, end_time, title, caption, hashtags } = req.body;

  try {
    // Clean up old files if they exist
    if (fs.existsSync("video.mp4")) fs.unlinkSync("video.mp4");
    if (fs.existsSync("clip.mp4")) fs.unlinkSync("clip.mp4");

    // Download the video using yt-dlp with user-agent to avoid blocking
    console.log("Downloading video...");
    execSync(`yt-dlp -f mp4 --user-agent "Mozilla/5.0" "${video_url}" -o video.mp4`);

    // Trim the video using ffmpeg
    console.log("Trimming video...");
    execSync(`ffmpeg -ss ${start_time} -to ${end_time} -i video.mp4 -c copy clip.mp4`);

    // Respond with success (you can later replace this with upload logic)
    res.status(200).json({
      message: "Clip created successfully",
      file: "clip.mp4",
      title,
      caption,
      hashtags,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Download failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});