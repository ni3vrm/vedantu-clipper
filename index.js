const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const { video_url, start_time, end_time, title, caption, hashtags } = req.body;

  if (!video_url || !start_time || !end_time || !title) {
    return res.status(400).json({
      error: 'Missing required fields',
      received: req.body,
    });
  }

  const outputFile = `clip-${Date.now()}.mp4`;
  const rawFile = 'video.mp4';

  exec(`yt-dlp -f mp4 "${video_url}" -o ${rawFile}`, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Download failed', details: err.message });
    }

    exec(`ffmpeg -ss ${start_time} -to ${end_time} -i ${rawFile} -c copy ${outputFile}`, (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Trimming failed', details: err2.message });
      }

      res.json({ message: 'Success', file: outputFile });
    });
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});