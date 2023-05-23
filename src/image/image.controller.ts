import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUpdateDto } from './dtos/image-update.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageUploadService) {}

  @Post('save')
  async saveImage(@Body() imageUpdateDto: ImageUpdateDto) {
    try {
      const result = await this.imageService.processImage(
        imageUpdateDto.imageUrl,
        imageUpdateDto.compress * 10
      );

      return {
        localpath: {
          original: result.originalPath,
          thumb: result.thumbPath,
        },
        metadata: result.metadata,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          errors: [
            {
              code: 404,
              message: 'Invalid URL',
            },
          ],
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
