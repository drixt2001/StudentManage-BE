import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';

@Module({
  imports: [],
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule {}
