import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ required: true })
  originalPath: string;

  @Prop({ required: true })
  thumbPath: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
