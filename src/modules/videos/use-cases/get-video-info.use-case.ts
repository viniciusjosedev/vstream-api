import { VideoService } from '../services/video.service';
import {
  FormatsFiltered,
  GetVideoInfoUseCaseDTO,
  VideoInfoUseCaseDTO,
} from '../dto/get-video-info.use-case.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetVideoInfoUseCase {
  constructor(private readonly videoService: VideoService) {}

  private getFirstNumbersInString(text: string): string | null {
    const numbers = text.match(/^\d+/);
    return numbers ? numbers[0] : null;
  }

  private async isUrlAccessible(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error in access a URL:', error);
      return false;
    }
  }

  private async getFormatsFiltered(url: string) {
    const allowFormats = ['240', '360', '480', '720', '1080'];
    const data: FormatsFiltered[] = [];

    const formats = await this.videoService.getFormats(url);

    await Promise.all(
      formats.map(async (format) => {
        const quality =
          this.getFirstNumbersInString(format.qualityLabel || '') || 'null';
        const hasValidUrl = await this.isUrlAccessible(format.url);

        if (
          (allowFormats.includes(quality) && hasValidUrl) ||
          (format.hasAudio && !format.hasVideo && hasValidUrl)
        ) {
          data.push({
            hasVideo: format.hasVideo,
            hasAudio: format.hasAudio,
            qualityVideo: format.qualityLabel,
            qualityAudio: format.quality,
            format: format.mimeType?.split(';')[0] as string,
            url: format.url,
          });
        }
      }),
    );

    return data;
  }

  public async execute({
    url,
    fields,
  }: GetVideoInfoUseCaseDTO): Promise<VideoInfoUseCaseDTO> {
    const data: VideoInfoUseCaseDTO = {};

    const { videoDetails } = await this.videoService.getInfo(url);

    await Promise.all(
      fields.map(async (field) => {
        switch (field) {
          case 'title':
            data.title = videoDetails.title;
            break;
          case 'channel':
            data.channel = {
              channel_url: videoDetails.author.channel_url,
              name: videoDetails.author.name,
              photo_url: videoDetails.author.avatar,
            };
            break;
          case 'thumbnail':
            data.thumbnail =
              videoDetails.thumbnails[videoDetails.thumbnails.length - 1];
            break;
          case 'formats':
            data.formats = await this.getFormatsFiltered(url);
        }
      }),
    );

    return data;
  }
}
