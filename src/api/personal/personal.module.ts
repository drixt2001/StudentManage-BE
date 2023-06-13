import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { SqlConnectModule } from 'src/database/query/sql-query.module';

@Module({
  imports: [SqlConnectModule],
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule {}
