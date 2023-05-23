import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerDocs } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerDocs(app);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}
bootstrap();
