import * as ytdl from '@distube/ytdl-core';

export class VideoService {
  public async getFormats(url: string) {
    return (await ytdl.getInfo(url)).formats;
  }

  public async getInfo(url: string) {
    return ytdl.getBasicInfo(url);
  }
}
