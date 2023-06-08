import { Injectable } from '@nestjs/common';
import { IPostgresConfig } from './postgres-config.i';

@Injectable()
export class PostgresConfig {
  public postgres: IPostgresConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'qlsv-2023',
    password: 'postgres',
    port: 5432,
  };
}
