import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const host = 'http://localhost';
export const port = 8000;
export const domain = host + ':' + port;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
