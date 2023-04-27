import { extname } from 'path';
import * as fs from 'fs';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);

  callback(null, `${name}${fileExtName}`);
};
