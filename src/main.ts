import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const host = 'http://localhost';
export const port = process.env.PORT;
export const domain = process.env.DOMAIN || host + ':' + port;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
