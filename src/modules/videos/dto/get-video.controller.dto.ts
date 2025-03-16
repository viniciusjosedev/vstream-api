import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetVideoControllerDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  url: string;
}
