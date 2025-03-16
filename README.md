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

Finally, you can download the video by choosing the URL of the format you acquired in the previous request in the formats array.

```bash
curl -X POST "http://localhost:8080/video/download" \
     -H "Authorization: Bearer access_token" \
     -H "Content-Type: application/json" \
     -d '{ 
           "url": "<URL-DOWNLOAD-VIDEO>" 
        }' \
     -o video.mp4
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

This project is licensed under the [MIT License](LICENSE).

## Contact

For more information, contact [Vinicius José](mailto:viniciusjosedev@gmail.com).

---

This README template follows best practices recommended by the community. For more details, check out the following resources:

- [How to Write a Good README](https://blog.rocketseat.com.br/como-fazer-um-bom-readme/)
- [How to Write an Amazing README on Your GitHub - Alura](https://www.alura.com.br/artigos/escrever-bom-readme)
- [A Template for a Good README.md - GitHub Gist](https://gist.github.com/lohhans/f8da0b147550df3f96914d3797e9fb89)

Additionally, you can watch the following video to better understand how to create an effective README:

[How to Write a Good README (PT-BR)](https://www.youtube.com/watch?v=k4Rsy8GbKE0)
