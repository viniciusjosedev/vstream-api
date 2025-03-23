import { IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetVideoControllerDTO {
  @ApiProperty({
    required: false,
    description: 'Video URL (required if url not provided)',
  })
  @Transform((value) => {
    return typeof value.value === 'string'
      ? decodeURIComponent(value.value)
      : value;
  })
  @ValidateIf((o) => !o.urlAudio)
  @IsNotEmpty({
    message: 'One of the fields urlVideo or urlAudio must be provided',
  })
  urlVideo?: string;

  @ApiProperty({ required: false, description: 'Audio URL (optional)' })
  @ValidateIf((o) => !o.urlVideo)
  @IsNotEmpty({
    message: 'One of the fields urlVideo or urlAudio must be provided',
  })
  urlAudio?: string;
}
