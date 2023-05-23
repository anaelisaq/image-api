import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageController } from './image.controller';
import { ImageUploadService } from './image-upload.service';
import { ImageSchema } from './image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageUploadService],
})
export class ImageModule {}
