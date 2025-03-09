import * as ytdl from '@distube/ytdl-core';

export interface GetVideoInfoDTO {
  url: string;
  fields: Array<'thumbnails' | 'formats' | 'title' | 'channel'>;
}

export interface VideoInfoDTO {
  title?: string;
  channel?: {
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    name: string;
    channel_url: string;
  };
  formats?: ytdl.videoFormat[];
  thumbnails?: ytdl.thumbnail;
}
