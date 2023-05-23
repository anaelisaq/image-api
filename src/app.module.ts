import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ehtkfel.mongodb.net/trakto`
    ),
    ImageModule,
  ],
})
export class AppModule {}
