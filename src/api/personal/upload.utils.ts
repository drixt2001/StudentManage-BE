import { extname } from 'path';
import * as fs from 'fs';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);

  callback(null, `${name}${fileExtName}`);
};

export function replaceName(folder) {
  fs.readdirSync(folder).forEach((file, index) => {
    fs.rename(`${folder}/${file}`, `${folder}/${index + 1}.jpg`, () => {
      //
    });
  });
}
