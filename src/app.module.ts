import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonalModule } from './api/personal/personal.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoginModule } from './api/auth/login/login.module';
import { ConfigModule } from '@nestjs/config';
import { DepartmentModule } from './api/department/department.module';
import { PeriodModule } from './api/period/period.module';
import { ModuleModule } from './api/module/module.module';
import { AppGateway } from './app/app.gateway';
import { ModuleService } from './api/module/module.service';
import { SqlConnectService } from './database/query/sql-query.service';
import { PostgresConfigModule } from './database/connect/postgres-config.module';

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
    DepartmentModule,
    PeriodModule,
    ModuleModule,
    PostgresConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, ModuleService, SqlConnectService],
})
export class AppModule {}
