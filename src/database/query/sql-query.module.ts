import { Module } from '@nestjs/common';
import { SqlConnectService } from './sql-query.service';
import { PostgresConfigModule } from '../connect/postgres-config.module';

@Module({
  imports: [PostgresConfigModule],
  providers: [SqlConnectService],
  exports: [SqlConnectService],
})
export class SqlConnectModule {}
