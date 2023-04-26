import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { domain } from '../../main';
import { replaceName } from './upload.utils';

@Injectable()
export class PersonalService {
  async uploadPicture(path: string, Id: string): Promise<any> {
    if (fs.existsSync(`./assets/Pictures/${Id}`)) {
      // const newFileNumber = fs.readdirSync(`./assets/Pictures/${Id}`).length;

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
      // replaceName(folderPath);
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
}
