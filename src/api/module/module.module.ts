import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { SqlConnectModule } from 'src/database/query/sql-query.module';

@Module({
  imports: [SqlConnectModule],
  providers: [ModuleService],
  controllers: [ModuleController],
})
export class ModuleModule {}
