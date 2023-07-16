import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { domain } from '../../main';
import { SqlConnectService } from 'src/database/query/sql-query.service';
import { map, mergeMap } from 'rxjs';

@Injectable()
export class PersonalService {
  constructor(private readonly sql: SqlConnectService) {}

  async uploadPicture(path: string, Id: string): Promise<any> {
    if (fs.existsSync(`./assets/Pictures/${Id}`)) {
      const fileName = fs.readdirSync(`./assets/Pictures/${Id}`);
      let genPath;
      if (!fileName.length) {
        genPath = `1.jpg`;
      } else {
        genPath = `${
          Number(fileName[fileName.length - 1]?.split('.')[0]) + 1
        }.jpg`;
      }

      const newPath = `./assets/Pictures/${Id}/` + genPath;
      fs.rename(path, newPath, function (err) {
        if (err)
          throw new NotFoundException('Quá trình chuyển thư mục thất bại');
      });

      return {
        name: genPath,
        status: 'done',
        url: domain + newPath.substring(1),
        thumbUrl: domain + newPath.substring(1),
      };
    } else {
      throw new NotFoundException('Không Tìm Thấy Dữ Liệu Ảnh Người Dùng');
    }
  }

  GetPictures(Id: string) {
    if (fs.existsSync(`./assets/Pictures/${Id}`)) {
      const fileName = [];
      fs.readdirSync(`./assets/Pictures/${Id}`).forEach((file) => {
        fileName.push(file);
      });
      const data = fileName.map((name) => {
        return {
          uid: name.split('.')[0],
          name: name,
          status: 'done',
          url: domain + `/assets/Pictures/${Id}/${name}`,
        };
      });
      return {
        maxNumber: Number(data[data.length - 1]?.uid) || 0,
        data: data,
      };
    } else {
      throw new NotFoundException('Không Tìm Thấy Dữ Liệu Ảnh Người Dùng');
    }
  }

  RemovePicture(Id: string, fileName: string) {
    const filePath = `./assets/Pictures/${Id}/${fileName}`;
    const folderPath = `./assets/Pictures/${Id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return {
        message: 'Xóa Thành Công!',
      };
    } else {
      throw new NotFoundException('Không Tìm Thấy Dữ Liệu Ảnh Người Dùng');
    }
  }

  uploadModel(model: any, Id: string) {
    if (fs.existsSync(`./assets/Model/${Id}`)) {
      const data = JSON.stringify(model);
      fs.writeFile(`./assets/Model/${Id}/model.json`, data, (err) => {
        if (err) {
          throw new NotFoundException('Lỗi ghi file');
        }
      });
      return {
        message: 'Cập Nhật Model Thành Công!',
      };
    } else {
      throw new NotFoundException('Không Tìm Thấy Thư Mục Người Dùng');
    }
  }

  getAll() {
    const data = [];
    fs.readdirSync(`./assets/Model`).forEach((folder) => {
      if (fs.existsSync(`./assets/Model/${folder}/model.json`)) {
        const model = JSON.parse(
          fs.readFileSync(`./assets/Model/${folder}/model.json`, 'utf-8'),
        );
        if (model.descriptors.length) data.push(model);
      }
    });
    return data;
  }

  createTeacher(type: string, body: any) {
    const folderPics = `./assets/Pictures/${body.id}`;
    const folderModel = `./assets/Model/${body.id}`;

    if (type === 'teacher') {
      const query = `INSERT INTO accounts
      (sid, role_id, "name", birthday, department_id, email, password, address)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning id;                            
      `;
      const params = [
        body.id,
        1,
        body.name,
        body.birthday,
        body.department,
        body.email,
        body.password,
        body.address,
      ];
      return this.sql.query(query, params).pipe(
        mergeMap((res) => {
          const query = `INSERT INTO teacher
          (acc_id, position)
          VALUES($1, $2);
          `;
          const params = [res.rows[0].id, body.role];
          return this.sql.query(query, params).pipe(
            map(() => {
              if (!fs.existsSync(folderPics) && body.id) {
                fs.mkdirSync(folderPics);
              } else {
                throw new ConflictException('Đã tồn tại');
              }
              if (!fs.existsSync(folderModel) && body.id) {
                fs.mkdirSync(folderModel);
              } else {
                throw new ConflictException('Đã tồn tại');
              }
              return { message: 'Tạo thành công!' };
            }),
          );
        }),
      );
    } else {
      const query = `INSERT INTO accounts
      (sid, role_id, "name", birthday, department_id, email, password, address)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning id;                        
      `;
      const params = [body.id, 2, body.name, body.birthday, body.department];
      return this.sql.query(query, params).pipe(
        mergeMap((res) => {
          const query = `INSERT INTO student
          (acc_id, class_id, academic_year)
          VALUES($1, $2, '2019-2023');
          `;
          const params = [res.rows[0].id, body.class];
          return this.sql.query(query, params).pipe(
            map(() => {
              if (!fs.existsSync(folderPics) && body.id) {
                fs.mkdirSync(folderPics);
              } else {
                throw new ConflictException('Đã tồn tại');
              }
              if (!fs.existsSync(folderModel) && body.id) {
                fs.mkdirSync(folderModel);
              } else {
                throw new ConflictException('Đã tồn tại');
              }
              return { message: 'Tạo thành công!' };
            }),
          );
        }),
      );
    }
  }

  getList(type: string, department: string, class_id: string, name: string) {
    let query: string;
    let ms: string;

    if (type === 'teacher') {
      query = `SELECT a.sid as id, a.name, a.birthday, d.short_name AS department, a.email, a.address FROM accounts a, departments d , teacher t 
      WHERE a.id = t.acc_id AND a.department_id = d.id`;
      ms = 'Lấy dữ liệu Giảng Viên thành công';
    } else {
      query = `SELECT a.sid as id, a.name, a.birthday, d.short_name AS department, c.short_name AS class_name, a.email, a.address FROM accounts a, departments d, student s, "class" c  
      WHERE a.id = s.acc_id AND a.department_id = d.id AND c.id = s.class_id `;
      ms = 'Lấy dữ liệu Sinh Viên thành công';
    }
    if (department) {
      query += ` AND d.id = ${department}`;
    }
    if (class_id) {
      query += ` AND c.id = ${class_id}`;
    }
    if (name) {
      query += ` AND a."name" ILIKE '%${name}%'`;
    }
    return this.sql.query(query).pipe(
      map((data) => {
        return {
          status: 'Thành công',
          message: ms,
          data: data.rows.map((row) => {
            return { ...row, pictures: this.getCountPic(row.id) };
          }),
        };
      }),
    );
  }

  getDetail(type: string, id: string) {
    let query: string;
    let ms: string;

    if (type === 'teacher') {
      query = `SELECT a.sid as id, a.name, a.birthday, d.id AS department, t.position as role, a.email, a.password, a.address FROM accounts a, departments d , teacher t 
      WHERE a.id = t.acc_id AND a.department_id = d.id AND a.sid = $1`;
      ms = 'Lấy dữ liệu Giảng Viên thành công';
    } else {
      query = `SELECT a.sid as id, a.name, a.birthday, d.id AS department, c.short_name AS class_name, c.id as "class", a.email, a.password, a.address FROM accounts a, departments d, student s, "class" c  
      WHERE a.id = s.acc_id AND a.department_id = d.id AND c.id = s.class_id AND a.sid = $1`;
      ms = 'Lấy dữ liệu Sinh Viên thành công';
    }

    return this.sql.query(query, [id]).pipe(
      map((data) => {
        return {
          status: 'Thành công',
          message: ms,
          data: data.rows[0],
        };
      }),
    );
  }

  getCountPic(Id: any) {
    if (fs.existsSync(`./assets/Pictures/${Id}`)) {
      let fileCount = 0;
      fs.readdirSync(`./assets/Pictures/${Id}`).forEach((file) => {
        fileCount = fileCount + 1;
      });
      return fileCount;
    } else {
      return 0;
    }
  }
}
