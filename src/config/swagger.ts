import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerDocs = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Image API')
    .setDescription(
      'Este é um projeto de uma API Rest desenvolvida utilizando o framework NestJS e o banco de dados MongoDB. O objetivo do projeto é fornecer um único endpoint que recebe uma URL pública de uma imagem JPG, salva essa imagem no sistema de arquivos, gera uma versão reduzida da imagem e armazena os metadados contidos no EXIF da imagem original em uma instância do MongoDB.'
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
};
