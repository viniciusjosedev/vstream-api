import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ValidFields {
  THUMBNAIL = 'thumbnail',
  FORMATS = 'formats',
  TITLE = 'title',
  CHANNEL = 'channel',
}

export class GetInfoControllerDTO {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsEnum(ValidFields, { each: true })
  fields: ValidFields[];
}
