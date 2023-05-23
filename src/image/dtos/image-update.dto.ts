import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class ImageUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.1)
  @Max(0.99)
  @ApiProperty({ example: 0.9 })
  compress: number;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://assets.storage.trakto.io/AkpvCuxXGMf3npYXajyEZ8A2APn2/0e406885-9d03-4c72-bd92-c6411fbe5c49.jpeg',
  })
  imageUrl: string;
}
