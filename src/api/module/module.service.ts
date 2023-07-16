import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { SqlConnectService } from 'src/database/query/sql-query.service';

@Injectable()
export class ModuleService {
  constructor(private readonly sql: SqlConnectService) {}

  getList() {
    const query = `SELECT
    m.id,
    m.sid,
    m."name",
    p.full_name AS PERIOD,
    d.short_name AS department,
    a."name" AS teacher,
    number_credit AS credit
  FROM
    modules m,
    periods p,
    departments d,
    teacher t,
    accounts a
  WHERE
    m.period_id = p.id
    AND m.department_id = d.id
    AND m.teacher_id = t.acc_id
    AND t.acc_id = a.id
  `;

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

  create(data: any) {
    const query = `INSERT INTO modules
    (sid, department_id, teacher_id, period_id, "name", number_credit)
    VALUES($1, $2, $3, $4, $5, $6);
    `;

    const params = [
      data.sid,
      data.department_id,
      data.teacher_id,
      data.period_id,
      data.name,
      data.credit,
    ];
    return this.sql.query(query, params).pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'Create module successfully',
          data: data.rows,
        };
      }),
      catchError(() => {
        throw new BadRequestException('Tạo lỗi (trùng mã)');
      }),
    );
  }
}
