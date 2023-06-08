import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../../auth/local-auth.guard';
import { AuthService } from '../../../auth/auth.service';

@Controller('auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('')
  login(@Req() req): any {
    return this.authService.login(req.user);
  }
}
