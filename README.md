# vstream-api

![Status Badge](https://img.shields.io/badge/status-beta-blue)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

## About

The **vstream-api** is an API developed to interact with YouTube videos. This project is currently in Beta development status and aims to fetch video information and download them.

In addition to the code being open source, the API is public, anyone can access it at: https://vstream-api.vinion.dev.
To see all routes, go to: https://vstream-api.vinion.dev/api

## Features

- Retrieve video information.
- Download videos in selected formats.

## Technologies Used

- NestJs
- @distube/ytdl-core

## Installation

To install and run this project locally, follow the steps below:

1. Clone the repository:
   ```bash
   git clone https://github.com/viniciusjosedev/vstream-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vstream-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure the environment variables according to the `.env.example` file:

```bash
# SET development OR test OR production
NODE_ENV=

# BY DEFAULT IS 8080
PORT=

# JWT SETTINGS
JWT_SECRET=
JWT_EXPIRES=
JWT_PASSPHRASE=

# COOKIES (SET IN JSON FORMAT WITH SINGLE QUOTES, REQUIRED ONLY IN PRODUCTION)
COOKIES=
```

5. Start the server:
   ```bash
   npm run start
   ```
Or, if you prefer, start with Docker:
```bash
npm run docker:up
```

## How to Use

Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the available endpoints. After starting the server, you can access the API via the endpoint:

```
http://localhost:8080/
```

You can see all endpoints with swagger in the /api route:

```
http://localhost:8080/api
```

The basic usage flow starts with getting your token from the /auth/generate-simple-token route.

```bash
curl -X POST "http://localhost:8080/auth/generate-simple-token" \
     -H "Content-Type: application/json" \
     -d '{}'
```

The return of this is:

```json
{
  "success": true,
  "data": {
    "access_token": "TOKEN"
  },
  "statusCode": 201
}
```

You can then get information about any public YouTube video using the /video/info route. To do this, you need to include the token in the request header (Authorization). In addition, the url and fields parameters must be passed as query parameters. Fields can be: title, channel, formats, thumbnail

```bash
curl -X GET "http://localhost:8080/video/info?url=youtube.com/watch?v=jNQXAC9IVRw&fields=title,channel,thumbnail,formats" \
     -H "Authorization: Bearer access_token" \
     -H "Content-Type: application/json"
```

The complete return if you pass all the fields is this:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "title": "Me at the zoo",
    "channel": {
      "channel_url": "https://www.youtube.com/channel/UC4QobU6STFB0P71PMvOGN5A",
      "name": "jawed",
      "photo_url": "https://yt3.ggpht.com/uI3VE4PVqvCy0xnWLqMJnEzyBUm3T8VHOCp4ee-1RxdHqKXCdUE_qXYQnpf9AfuEoIPactVyDhM=s48-c-k-c0x00ffffff-no-rj"
    },
    "thumbnail": {
      "url": "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgBvgKAAvABigIMCAAQARhVIFkoZTAP&rs=AOn4CLB7NY0fx4yZYDj27223V3b7Sowf5w",
      "width": 336,
      "height": 188
    },
    "formats": [
      {
        "hasVideo": true,
        "hasAudio": true,
        "qualityVideo": "240p",
        "qualityAudio": "small",
        "format": "video/mp4",
        "url": "<URL-DOWNLOAD-VIDEO>"
      },
      "..."
    ]
  }
}
```

To download the video, you should choose the desired format URLs from the previous request in the "formats" array. Note the following properties:

formats: Array with different available formats
hasVideo and hasAudio: Indicate whether the format contains video and/or audio

It's important to understand that:

Some lower quality formats will have both hasVideo: true and hasAudio: true
Most higher quality formats will have hasVideo: true but hasAudio: false
A few formats will be audio-only (hasVideo: false and hasAudio: true)

This is why the API allows you to combine custom video and audio selections through the /video/download endpoint. You need to send:

urlVideo: URL of the chosen video format
urlAudio: URL of the chosen audio format

Important format details:

If you send only the urlAudio parameter, the audio will always be delivered in MP3 format
If you send both video and audio parameters or just the video parameter, the video will maintain the same format it had in the previous request
If you select a format that already has both video and audio (hasVideo: true and hasAudio: true) as your urlVideo and still provide a urlAudio, the original audio in the video will be replaced by the audio you specified in urlAudio

Additional notes:

The API uses streaming (sending by chunks)
Tools like curl and wget may not work properly
The X-Content-Length header provides the file size to estimate download time

Check the file type to use the correct extension, although in the examples all are saved as .mp4.
JavaScript code is available that can be run in any browser console to facilitate the process.

```js
async function downloadFile() {
  try {
      const url = "http://localhost:8080/video/download";
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer access_token',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              urlVideo: 'https://rr4---sn-p5qlsn6l.googlevideo.com...',
              urlAudio: 'https://rr4---sn-p5qlsn6l.googlevideo.com...'
          })
      });

      if (!response.ok) {
          throw new Error(`Err: ${response.status} ${response.statusText}`);
      }

      const contentLength = response.headers.get("X-Content-Length");
      const totalSize = contentLength ? parseInt(contentLength, 10) : null;

      
      console.log(`All size file: ${totalSize ? `${(totalSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}`);

      console.log('contentLength', contentLength)

      const reader = response.body.getReader();
      let receivedSize = 0;
      const chunks = [];

      while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedSize += value.length;

          if (totalSize) {
              const progress = ((receivedSize / totalSize) * 100).toFixed(2);
              console.log(`Progress: ${progress}% (${(receivedSize / 1024 / 1024).toFixed(2)} MB done)`);
          } else {
              console.log(`Downloading... (${(receivedSize / 1024 / 1024).toFixed(2)} MB done)`);
          }
      }

      const blob = new Blob(chunks);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "download.mp4";

      if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
              fileName = match[1];
          }
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("✅ Download done!");

  } catch (error) {
      console.error("❌ Err in download file:", error);
  }
}

downloadFile();
```

Another example, this time in a node js environment (18+). For this example, install the file-type lib, version 16.5.4.

```bash
npm i file-type@16.5.4
```

```js
const fs = require('fs');
const FileType = require('file-type')

const urlVideo = 'https://rr4---sn-p5qlsn6l.googlevideo.com...';
const token = 'access_token';

async function downloadFile() {
  try {
    const response = await fetch('http://localhost:8080/video/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urlVideo,
      })
    });

    if (!response.ok) {
      console.log(await response.json());
      
      throw new Error('Error making the request');
    }

    const arrayBuffer = await response.arrayBuffer();

    const fileType = await FileType.fromBuffer(arrayBuffer);

    if (!fileType) {
      throw new Error("Impossible to get the file type of file.");
    }

    let extension = fileType.ext;		

    const buffer = Buffer.from(arrayBuffer)

    await fs.promises.writeFile(`file.${extension}`, buffer)

    console.log('Download completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadFile();

```

## Testing

To run unit tests, use the command:

```bash
npm run test
```

For integration tests, use the command:

```bash
npm run test:e2e
```

If you want to run the tests inside Docker, use the command:

```bash
npm run docker:attach
```

## License

This project is licensed under the [Educational Use License](LICENSE).

## Contact

For more information, contact [Vinicius José](mailto:viniciusjosedev@gmail.com).

---

This README template follows best practices recommended by the community. For more details, check out the following resources:

- [How to Write a Good README](https://blog.rocketseat.com.br/como-fazer-um-bom-readme/)
- [How to Write an Amazing README on Your GitHub - Alura](https://www.alura.com.br/artigos/escrever-bom-readme)
- [A Template for a Good README.md - GitHub Gist](https://gist.github.com/lohhans/f8da0b147550df3f96914d3797e9fb89)

Additionally, you can watch the following video to better understand how to create an effective README:

[How to Write a Good README (PT-BR)](https://www.youtube.com/watch?v=k4Rsy8GbKE0)
