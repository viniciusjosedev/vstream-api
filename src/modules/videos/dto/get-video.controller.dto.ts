import { IsNotEmpty } from 'class-validator';

export class GetVideoControllerDTO {
  @IsNotEmpty()
  url: string;
}
