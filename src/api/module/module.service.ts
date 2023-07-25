import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, from, map, mergeMap } from 'rxjs';
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
    number_credit AS credit,
    m.allow_delay,
    m.allow_leaving,
    (
      SELECT
        COUNT(student_id)
      FROM
        module_student
      WHERE
        module_id = m.id 
    ) as count_student
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

  getDetail(id: string) {
    const query = `SELECT
    m.id,
    m.sid,
    m."name",
    p.full_name AS PERIOD,
    d.short_name AS department,
    a."name" AS teacher,
    number_credit AS credit,
    p.id AS period_id,
    d.id AS department_id,
    a.id AS teacher_id,
    m.allow_delay,
    m.allow_leaving,
    (
    SELECT
      array_to_json(array_agg(students)) AS students
    FROM
      (
      SELECT
        a.sid AS id,
        a.name,
        a.birthday,
        a.email,
        a.address,
        a.id AS student_id
      FROM
        module_student ms,
        modules m,
        accounts a
      WHERE
        ms.module_id = m.id
        AND ms.student_id = a.id
        AND m.id = $1 ) students)
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
    AND m.id = $1
  
  `;

    return this.sql.query(query, [id]).pipe(
      map((data) => {
        return {
          status: 'success',
          message: 'Get details successfully',
          data: data.rows[0],
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

  addStudent(data: any) {
    const query = `INSERT INTO module_student
    (module_id, student_id)
    VALUES($1, $2);
    `;

    const params = [data.module_id, data.student_id];

    return this.sql.query(query, params).pipe(
      map(() => {
        return {
          status: 'success',
          message: 'Add student successfully',
        };
      }),
      catchError(() => {
        throw new BadRequestException('Thêm lỗi');
      }),
    );
  }

  deleteStudent(id: any) {
    const query = `DELETE FROM module_student
    WHERE student_id = $1;
    `;
    const params = [id];

    return this.sql.query(query, params).pipe(
      map(() => {
        return {
          status: 'success',
          message: 'Delete student successfully',
        };
      }),
      catchError(() => {
        throw new BadRequestException('Xóa lỗi');
      }),
    );
  }

  getWeekdays() {
    const query = `SELECT id, "name" FROM weekdays;`;

    return this.sql.query(query).pipe(
      map((res) => {
        return {
          status: 'success',
          message: 'Get weekdays successfully',
          data: res.rows,
        };
      }),
    );
  }

  getSchedule(id: any) {
    const query = `SELECT module_id, weekday_id, start_on_day, end_on_day
    FROM schedule
    WHERE module_id = $1;
    ;
    `;

    return this.sql.query(query, [id]).pipe(
      map((res) => {
        return {
          status: 'success',
          message: 'successfully',
          data: res.rows,
        };
      }),
    );
  }

  updateSchedule(id: any, data: any[]) {
    const query = `DELETE FROM schedule
    WHERE module_id = $1;
    `;

    return this.sql.query(query, [id]).pipe(
      mergeMap(() => {
        const queryAdd = `INSERT INTO schedule
        (module_id, weekday_id, start_on_day, end_on_day)
        VALUES($1, $2, $3, $4);
        `;
        return from(data).pipe(
          map((day: any) => {
            const paramsUser_Role = [id, day.id, day.start, day.end];
            return this.sql.query(queryAdd, paramsUser_Role).pipe();
          }),
        );
      }),
      map(() => {
        return {
          status: 'success',
          message: 'successfully',
        };
      }),
    );
  }

  updateAllow(id: any, data: any) {
    const query = `UPDATE modules
    SET allow_delay = $1, allow_leaving = $2
    WHERE id = $3;
    `;

    return this.sql
      .query(query, [data.allow_delay, data.allow_leaving, id])
      .pipe(
        map(() => {
          return {
            status: 'success',
            message: 'successfully',
          };
        }),
      );
  }
}
