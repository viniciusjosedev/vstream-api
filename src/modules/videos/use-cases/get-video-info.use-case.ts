import { VideoService } from '../services/video.service';
import {
  GetVideoInfoDTO,
  VideoInfoDTO,
} from '../dto/get-video-info.use-case.dto';

export class GetVideoInfo {
  public async execute({
    url,
    fields,
  }: GetVideoInfoDTO): Promise<VideoInfoDTO> {
    const videoService = new VideoService();

    const data: VideoInfoDTO = {};

    const { videoDetails } = await videoService.getInfo(url);

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
              thumbnail:
                videoDetails.thumbnails[videoDetails.thumbnails.length - 1],
            };
            break;
          case 'thumbnails':
            data.thumbnails =
              videoDetails.thumbnails[videoDetails.thumbnails.length - 1];
            break;
          case 'formats':
            data.formats = await videoService.getFormats(url);
        }
      }),
    );

    return data;
  }
}
