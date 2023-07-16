import { Module } from '@nestjs/common';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';
import { SqlConnectModule } from 'src/database/query/sql-query.module';

@Module({
  imports: [SqlConnectModule],
  controllers: [PeriodController],
  providers: [PeriodService],
})
export class PeriodModule {}
