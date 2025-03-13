import { VideoService } from '../services/video.service';
import {
  FormatsFiltered,
  GetVideoInfoDTO,
  VideoInfoDTO,
} from '../dto/get-video-info.use-case.dto';

export class GetVideoInfo {
  constructor(private readonly videoService: VideoService) {}

  private getFirstNumbersInString(text: string) {
    const numbers = text.match(/^\d+/);

    return numbers ? numbers[0] : null;
  }

  private async getFormatsFiltered(url: string) {
    const allowFormats = ['240', '360', '480', '720', '1080'];

    const data: FormatsFiltered[] = [];

    (await this.videoService.getFormats(url)).forEach((format) => {
      if (
        allowFormats.includes(
          this.getFirstNumbersInString(format.qualityLabel || '') || 'null',
        ) ||
        (format.hasAudio && !format.hasVideo)
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
    });

    return data;
  }

  public async execute({
    url,
    fields,
  }: GetVideoInfoDTO): Promise<VideoInfoDTO> {
    const data: VideoInfoDTO = {};

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
