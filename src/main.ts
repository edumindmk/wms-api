import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Workforce Management System')
    .setDescription('The workforce management system API description')
    .setVersion('1.0')
    .addTag('workforce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // This sets up the UI at http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
