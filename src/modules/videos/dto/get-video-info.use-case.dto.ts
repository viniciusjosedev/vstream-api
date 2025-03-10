import * as ytdl from '@distube/ytdl-core';

export interface GetVideoInfoDTO {
  url: string;
  fields: Array<'thumbnails' | 'formats' | 'title' | 'channel'>;
}

export interface FormatsFiltered {
  hasVideo: boolean;
  hasAudio: boolean;
  qualityVideo: string;
  qualityAudio: string;
  format: string;
  url: string;
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
  formats?: FormatsFiltered[];
  thumbnails?: ytdl.thumbnail;
}
