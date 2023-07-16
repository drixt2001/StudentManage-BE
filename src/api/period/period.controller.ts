import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PeriodService } from './period.service';

@Controller('period')
export class PeriodController {
  constructor(public service: PeriodService) {}

  @Get()
  getList() {
    return this.service.getList();
  }

  @Get('now')
  getActive() {
    return this.service.activeNow();
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Body() dto: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
