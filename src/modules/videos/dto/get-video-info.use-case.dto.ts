import * as ytdl from '@distube/ytdl-core';

export interface GetVideoInfoUseCaseDTO {
  url: string;
  fields: Array<'thumbnail' | 'formats' | 'title' | 'channel'>;
}

export interface FormatsFiltered {
  hasVideo: boolean;
  hasAudio: boolean;
  qualityVideo: string;
  qualityAudio: string;
  format: string;
  url: string;
}

export interface VideoInfoUseCaseDTO {
  title?: string;
  channel?: {
    photo_url: string;
    name: string;
    channel_url: string;
  };
  formats?: FormatsFiltered[];
  thumbnail?: ytdl.thumbnail;
}
