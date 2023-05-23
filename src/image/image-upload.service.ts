import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import * as axios from 'axios';
import { Image, ImageDocument } from './image.schema';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>
  ) {}

  async processImage(imageUrl: string, compress: number): Promise<Image> {
    const response = await axios.default.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data);

    const metadata = await sharp(imageBuffer).metadata();

    const { width, height } = metadata;
    const maxDimension = Math.max(width, height);
    const thumbWidth = maxDimension > 720 ? 720 : width;
    const thumbHeight =
      maxDimension > 720 ? Math.round((720 / maxDimension) * height) : height;

    const thumbBuffer = await sharp(imageBuffer)
      .resize(thumbWidth, thumbHeight)
      .jpeg({ quality: compress })
      .toBuffer();

    const thumbPath = `uploads/thumb_${Date.now()}.jpg`;
    const originalPath = `uploads/original_${Date.now()}.jpg`;

    await Promise.all([
      fs.writeFile(originalPath, imageBuffer),
      fs.writeFile(thumbPath, thumbBuffer),
    ]);

    const exifMetadata = await sharp(imageBuffer)
      .metadata()
      .then((metadata) => {
        return metadata.exif;
      });

    const image = new this.imageModel({
      originalPath,
      thumbPath,
      metadata: {
        ...metadata,
        exif: exifMetadata,
      },
    });

    await image.save();

    return {
      originalPath,
      thumbPath,
      metadata: {
        ...metadata,
        exif: exifMetadata,
      },
    };
  }
}
