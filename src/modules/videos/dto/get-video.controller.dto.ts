import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetVideoControllerDTO {
  @ApiProperty({ required: true })
  @Transform((value) => {
    return typeof value.value === 'string'
      ? decodeURIComponent(value.value)
      : value;
  })
  @IsNotEmpty()
  url: string;
}
