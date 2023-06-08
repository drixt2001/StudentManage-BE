import { Injectable } from '@nestjs/common';
import { IPostgresConfig } from './postgres-config.i';

@Injectable()
export class PostgresConfig {
  public postgres: IPostgresConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
  };
}
