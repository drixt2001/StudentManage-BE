import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { domain } from '../../main';

@Injectable()
export class PersonalService {
  async uploadPicture(path: string, Id: string): Promise<any> {
    if (fs.existsSync(`./assets/Pictures/${Id}`)) {
      const newFileNumber = fs.readdirSync(`./assets/Pictures/${Id}`).length;

      const newPath = `./assets/Pictures/${Id}/${newFileNumber + 1}.jpg`;

      fs.rename(path, newPath, function (err) {
        if (err)
          throw new NotFoundException('Quá trình chuyển thư mục thất bại');
      });

      return {
        name: newFileNumber + 1 + '.jpg',
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

      return fileName.map((name) => {
        return {
          uid: name.split('.')[0],
          name: name,
          status: 'done',
          url: domain + `/assets/Pictures/${Id}/${name}`,
        };
      });
    } else {
      throw new NotFoundException('Không Tìm Thấy Dữ Liệu Ảnh Người Dùng');
    }
  }

  RemovePicture(Id: string, fileName: string) {
    const filePath = `./assets/Pictures/${Id}/${fileName}`;
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
}
