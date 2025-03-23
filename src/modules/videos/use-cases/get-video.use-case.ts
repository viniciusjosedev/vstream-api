import { Injectable } from '@nestjs/common';
import { GetVideoUseCaseDTO } from '../dto/get-video.use-case.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as Ffmpeg from 'fluent-ffmpeg';
import * as FileType from 'file-type';
import core from 'file-type/core';

@Injectable()
export class GetVideoUseCase {
  private pathTempFolder = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'temp',
  );

  private async createTempFolder() {
    await fs.promises.mkdir(this.pathTempFolder, { recursive: true });
  }

  private async processNextChunk({
    contentLength,
    startByte,
    url,
  }: {
    startByte: number;
    contentLength: number;
    url: string;
  }) {
    const chunkSize = 1048576;

    if (startByte >= contentLength) {
      return null;
    }

    const endByte = Math.min(startByte + chunkSize - 1, contentLength - 1);

    const chunkResponse = await fetch(url, {
      headers: {
        Range: `bytes=${startByte}-${endByte}`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.youtube.com/',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Connection: 'keep-alive',
      },
    });

    if (!chunkResponse.ok && chunkResponse.status !== 206) {
      throw new Error(`HTTP Error: ${chunkResponse.status}`);
    }

    const buffer = Buffer.from(await chunkResponse.arrayBuffer());

    return { buffer, startByte: endByte + 1 };
  }

  private async saveFile(url: string) {
    await this.createTempFolder();

    let startByte = 0;

    const headResponse = await fetch(url, { method: 'HEAD' });
    const contentLength = parseInt(
      headResponse.headers.get('Content-Length') || '0',
    );

    if (contentLength === 0) {
      throw new Error('Could not determine video size');
    }

    const nameFile = new Date().getTime();
    const pathFile = path.resolve(this.pathTempFolder, `${nameFile}`);

    const writeStream = fs.createWriteStream(pathFile);

    while (true) {
      const chunk = await this.processNextChunk({
        contentLength,
        startByte,
        url,
      });

      if (chunk === null) {
        writeStream.end();
        break;
      }

      startByte = chunk.startByte;

      writeStream.write(chunk.buffer);
    }

    return pathFile;
  }

  private async deleteFile(path: string) {
    await fs.promises.unlink(path);
  }

  private async convertToMp3(path: string) {
    const ffmpeg = Ffmpeg();
    const pathSplit = path.split('/');
    const nameFile = `${pathSplit[pathSplit.length - 1]}.mp3`;

    await new Promise((resolve, reject) => {
      ffmpeg
        .addInput(path)
        .audioCodec('libmp3lame')
        .format('mp3')
        .on('end', () => {
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        })
        .save(nameFile);
    });

    this.deleteFile(path);

    return nameFile;
  }

  private async returnWithVideoEdited({
    res,
    urlVideo,
    urlAudio,
  }: GetVideoUseCaseDTO) {
    const ffmpeg = Ffmpeg();

    const headResponse = await fetch(urlVideo as string, { method: 'HEAD' });
    const contentLength = parseInt(
      headResponse.headers.get('Content-Length') || '0',
    );

    if (contentLength === 0) {
      throw new Error('Could not determine video size');
    }

    const [videoPath, audioPath] = await Promise.all([
      await this.saveFile(urlVideo as string),
      await this.saveFile(urlAudio as string),
    ]);

    const fileType = await FileType.fromFile(videoPath);

    if (!fileType) {
      throw new Error('Type not found');
    }

    const { ext, mime } = fileType;

    const nameFile = `${new Date().getTime()}.${ext}`;
    const pathFile = path.resolve(this.pathTempFolder, nameFile);

    await new Promise((resolve, reject) => {
      ffmpeg
        .addInput(videoPath)
        .addInput(audioPath)
        .outputOption(['-map 0:v', '-map 1:a', '-c:v copy'])
        .on('error', (err) => {
          this.deleteFile(videoPath);
          this.deleteFile(audioPath);

          reject(err);
        })
        .on('end', () => {
          this.deleteFile(videoPath);
          this.deleteFile(audioPath);

          resolve(true);
        })
        .save(pathFile);
    });

    const processedStats = fs.statSync(pathFile);
    res.setHeader('Content-Type', mime);
    res.setHeader('X-Content-Length', processedStats.size.toString());

    fs.createReadStream(pathFile)
      .pipe(res)
      .on('close', () => {
        this.deleteFile(pathFile);

        res.end();
      });
  }

  private async returnWithoutVideoEdited({
    res,
    urlVideo,
  }: GetVideoUseCaseDTO) {
    const headResponse = await fetch(urlVideo as string, { method: 'HEAD' });

    if (!headResponse.ok) {
      throw new Error('Error in request with urlVideo');
    }

    const contentLength = parseInt(
      headResponse.headers.get('Content-Length') || '0',
    );
    const contentType = headResponse.headers.get('Content-Type') || '';

    if (contentLength === 0) {
      throw new Error('Could not determine video size');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Length', contentLength.toString());

    let startByte = 0;

    while (true) {
      const chunk = await this.processNextChunk({
        contentLength,
        startByte,
        url: urlVideo as string,
      });

      if (chunk === null) {
        break;
      }

      startByte = chunk.startByte;

      res.write(chunk.buffer);
    }

    res.end();
  }

  private async returnOnlyAudio({ res, urlAudio }: GetVideoUseCaseDTO) {
    const headResponse = await fetch(urlAudio as string, { method: 'HEAD' });

    if (!headResponse.ok) {
      throw new Error('Error in request with urlAudio');
    }

    const contentLength = parseInt(
      headResponse.headers.get('Content-Length') || '0',
    );

    if (contentLength === 0) {
      throw new Error('Could not determine audio size');
    }

    const audioPath = await this.saveFile(urlAudio as string);
    const audioMp3Path = await this.convertToMp3(audioPath);

    const processedStats = fs.statSync(audioMp3Path);

    const fileType = (await FileType.fromFile(
      audioMp3Path,
    )) as core.FileTypeResult;

    res.setHeader('Content-Type', fileType.mime);
    res.setHeader('X-Content-Length', processedStats.size.toString());

    fs.createReadStream(audioMp3Path)
      .pipe(res)
      .on('close', () => {
        this.deleteFile(audioMp3Path);

        res.end();
      });
  }

  public async execute(data: GetVideoUseCaseDTO): Promise<void> {
    if (data.urlVideo && data.urlAudio) await this.returnWithVideoEdited(data);
    else if (!data.urlVideo && data.urlAudio) await this.returnOnlyAudio(data);
    else if (data.urlVideo) await this.returnWithoutVideoEdited(data);
  }
}
