import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SqlConnectService } from '../database/query/sql-query.service';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private sqlConnectService: SqlConnectService,
  ) {}

  async validateUser(email: string, pass: string) {
    const query = `SELECT
    acc.id,
    email,
    "password",
    r.role_code AS "role",
    r.routerlink AS "router_link"
  FROM
    accounts acc,
    "role" r
  WHERE
    acc.role_id = r.id AND email = $1`;

    const res = await this.sqlConnectService.queryLogin(query, [email]);
    const user = res.rowCount === 1 ? res.rows[0] : null;
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      status: 'success',
      message: 'Đăng nhập thành công',
      router_link: user.router_link,
      access_token: access_token,
    };
  }

  getInfo(acc_id: number) {
    const sqlQuery = `SELECT acc.id, acc."name", email, r.role_code, r."name" AS "role", r.routerlink as "link" from accounts acc, "role" r
    WHERE acc.role_id = r.id AND acc.id = $1`;
    const param = [acc_id];

    return this.sqlConnectService.query(sqlQuery, param).pipe(
      map((res) => {
        if (res.rows[0]) return res.rows[0];
        else throw new NotFoundException('Không tìm thấy người dùng này');
      }),
    );
  }
}
