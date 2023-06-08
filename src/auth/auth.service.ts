import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SqlConnectService } from '../database/query/sql-query.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private sqlConnectService: SqlConnectService,
  ) {}

  async validateUser(email: string, pass: string) {
    const query = `SELECT * from accounts WHERE email = $1`;
    const res = await this.sqlConnectService.queryLogin(query, [email]);
    const user = res.rowCount === 1 ? res.rows[0] : null;
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      status: 'success',
      message: 'Đăng nhập thành công',
      access_token: access_token,
    };
  }
}
