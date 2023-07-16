import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { map, mergeMap } from 'rxjs';
import { SqlConnectService } from 'src/database/query/sql-query.service';

@Injectable()
export class PeriodService {
  constructor(private readonly sql: SqlConnectService) {}

  getList() {
    const query = `SELECT
    id,
    full_name,
    START,
    "end"
  FROM
    PERIODS
  ORDER BY
    START DESC`;
    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'Get list successfully',
          data: data.rows,
        };
      }),
    );
  }

  activeNow() {
    return this.sql
      .query(
        `SELECT id, full_name, "start", "end" FROM "periods" WHERE "start" <= CURRENT_DATE AND "end" >= CURRENT_DATE`,
      )
      .pipe(
        map((data) => {
          return {
            status: 'success',
            message: 'Get active period successfully',
            data: data.rows,
          };
        }),
      );
  }

  checkTimeUsing(start: string) {
    return this.sql
      .query(
        `SELECT id, full_name, "start", "end" FROM "periods" WHERE "end" >= $1`,
        [start],
      )
      .pipe(
        map((data) => {
          if (data.rowCount) return true;
          else return false;
        }),
      );
  }

  create(dto: any) {
    const params = [dto.full_name, dto.start, dto.end];
    return this.checkTimeUsing(dto.start).pipe(
      mergeMap((res) => {
        if (res === false) {
          return this.sql
            .query(
              `INSERT INTO "periods" (full_name, "start", "end") VALUES ($1, $2, $3)`,
              params,
            )
            .pipe(
              map((data) => {
                return {
                  status: 'success',
                  message: 'Create period successfully',
                  data: data.rows,
                };
              }),
            );
        } else {
          throw new BadRequestException(
            'Kỳ bạn tạo có thời gian trước một kỳ khác kết thúc!',
          );
        }
      }),
    );
  }

  update(id, dto) {
    const query = `UPDATE "periods" SET full_name=$1, "start"=$2, "end"=$3 WHERE id = $4`;
    const params = [dto.full_name, dto.start, dto.end, id];

    return this.sql.query(query, params).pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'update successfully',
          data: data.rows,
        };
      }),
    );
  }

  delete(id) {
    return this.sql.query('DELETE FROM periods WHERE id = $1;', [id]).pipe(
      map((data) => {
        if (data.rowCount !== 1) {
          throw new NotFoundException(`Không tìm thấy kỳ này`);
        } else {
          return {
            status: 'success',
            message: `delete period ${id} successfully`,
            data: data.rows,
          };
        }
      }),
    );
  }
}
