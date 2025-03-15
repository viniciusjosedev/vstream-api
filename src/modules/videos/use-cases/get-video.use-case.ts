import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

@Injectable()
export class GetVideoUseCase {
  public async execute(url: string, res: Response): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error in request: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Body is not stream');
    }

    res.setHeader(
      'Content-Type',
      response.headers.get('Content-Type') || 'application/octet-stream',
    );
    res.setHeader(
      'Content-Length',
      response.headers.get('Content-Length') || '',
    );
    res.setHeader('Transfer-Encoding', 'chunked');

    const reader = response.body.getReader();

    const nodeReadable = new Readable({
      async read() {
        const { done, value } = await reader.read();

        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      },
    });

    nodeReadable.pipe(res);
    nodeReadable.on('end', () => res.end());
  }
}
