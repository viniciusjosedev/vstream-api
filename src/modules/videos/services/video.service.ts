import * as ytdl from '@distube/ytdl-core';
import { variablesEnv } from 'src/envs/variables.env';

export class VideoService {
  private readonly agent: ytdl.Agent;

  constructor() {
    this.agent = ytdl.createAgent(JSON.parse(variablesEnv.cookies));
  }

  public async getFormats(url: string) {
    return (await ytdl.getInfo(url, { agent: this.agent })).formats;
  }

  public async getInfo(url: string) {
    return ytdl.getBasicInfo(url, { agent: this.agent });
  }
}
