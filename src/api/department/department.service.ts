import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { SqlConnectService } from 'src/database/query/sql-query.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly sql: SqlConnectService) {}

  GetListDepartments() {
    const query = `SELECT id, full_name, address, phone, short_name as name
    FROM departments`;
    const ms = 'Lấy dữ liệu Khoa thành công';

    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: 'Thành công',
          message: ms,
          data: data.rows,
        };
      }),
    );
  }

  GetListClass(department_id: string) {
    const query = `SELECT id, full_name, short_name as name FROM "class" c WHERE c.department_id = $1`;
    const ms = 'Lấy dữ liệu Lớp thành công';

    return this.sql.query(query, [department_id]).pipe(
      map((data) => {
        return {
          status: 'Thành công',
          message: ms,
          data: data.rows,
        };
      }),
    );
  }
}
