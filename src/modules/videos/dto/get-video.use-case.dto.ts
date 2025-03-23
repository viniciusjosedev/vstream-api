import { Response } from 'express';

export interface GetVideoUseCaseDTO {
  urlVideo?: string;
  urlAudio?: string;
  res: Response;
}
