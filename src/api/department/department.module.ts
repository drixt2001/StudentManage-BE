import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { SqlConnectModule } from 'src/database/query/sql-query.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [SqlConnectModule],
})
export class DepartmentModule {}
