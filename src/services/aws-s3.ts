import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { ValidateFileError } from '../errors/validate-file-error';

AWS.config.loadFromPath(__dirname + '/../config/aws.json');

const s3 = new AWS.S3();

export const upload = (s3Path: string) => {
  const uploadS3 = multer({
    fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if (isPhoto) {
        next(null, true);
      } else {
        next(new ValidateFileError('이미지 파일이 아닙니다.'));
      }
    },
    storage: multerS3({
      s3: s3,
      bucket: 'image.mercuryeunoia.com',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (_req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, `images/${s3Path}/${Date.now().toString()}${extension}`);
      },
      acl: 'public-read',
    }),
  });
  return uploadS3;
};
