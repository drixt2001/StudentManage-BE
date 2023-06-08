import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonalModule } from './api/personal/personal.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoginModule } from './api/auth/login/login.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets/',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PersonalModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
