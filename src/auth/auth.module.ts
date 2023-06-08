import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { SqlConnectModule } from '../database/query/sql-query.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'qlsv-2023-ntt',
      signOptions: { expiresIn: '3d' },
    }),
    SqlConnectModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
