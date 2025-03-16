import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum ValidFields {
  THUMBNAIL = 'thumbnail',
  FORMATS = 'formats',
  TITLE = 'title',
  CHANNEL = 'channel',
}

export class GetInfoControllerDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    required: true,
    description: 'Fields to include in the response',
    enum: ValidFields,
    isArray: true,
    example: ['title', 'formats'],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsEnum(ValidFields, { each: true })
  fields: ValidFields[];
}
