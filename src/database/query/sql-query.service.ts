import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { from, map } from 'rxjs';
import { PostgresConfig } from '../connect/postgres-config.service';
import { SQLResult } from './sql-query-result.i';

@Injectable()
export class SqlConnectService {
  constructor(private readonly pgConfig: PostgresConfig) {}

  public query(text: string, params?: Array<unknown>) {
    const pool = new Pool({
      host: this.pgConfig.postgres.host,
      database: this.pgConfig.postgres.database,
      user: this.pgConfig.postgres.user,
      password: this.pgConfig.postgres.password,
      port: this.pgConfig.postgres.port,
    });
    return from(pool.query(text, params)).pipe(
      map((res) => {
        pool.end();
        return res as SQLResult;
      }),
    );
  }
  public async queryLogin(text: string, params?: Array<unknown>) {
    const pool = new Pool({
      host: this.pgConfig.postgres.host,
      database: this.pgConfig.postgres.database,
      user: this.pgConfig.postgres.user,
      password: this.pgConfig.postgres.password,
      port: this.pgConfig.postgres.port,
    });
    const res = await pool.query(text, params);
    pool.end();
    return res;
  }
}
