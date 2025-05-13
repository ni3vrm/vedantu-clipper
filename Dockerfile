FROM node:20-slim

RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]