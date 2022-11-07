import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'MyFinance',
          format: 'webp',
          width: 500,
          height: 500,
          crop: 'limit',
          maxImageFileSize: 1000000,
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadAvatar(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'MyFinance',
          format: 'webp',
          width: 50,
          height: 50,
          crop: 'limit',
          maxImageFileSize: 500000,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async destroyImage(publicId: string): Promise<void> {
    await v2.uploader.destroy(publicId);

    console.log('Image deleted');
  }
}
