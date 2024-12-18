import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as mime from 'mime-types';
import slugify from 'slugify';

@Injectable()
export class MinioProvider {
  updateFile(img: Express.Multer.File, imageIndex: any): any {
    throw new Error('Method not implemented.');
  }
  private readonly minioClient: Minio.Client;
  public readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  // Hàm để chuẩn hóa tên file bằng cách loại bỏ ký tự không phải ASCII
  private sanitizeFileName(fileName: string): string {
    return slugify(fileName, { lower: true }); // Chuyển đổi tên file sang dạng ASCII
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('Không có file nào được tải lên.');
    }
    const sanitizedFileName = this.sanitizeFileName(file.originalname); // Chuẩn hóa tên file
    const timestamp = Date.now();
    const fullFileName = `${timestamp}-${sanitizedFileName}`;
    const metadata = {
      'Content-Type':
        mime.lookup(file.originalname) || 'application/octet-stream',
    };

    await this.minioClient.putObject(
      this.bucketName,
      fullFileName,
      file.buffer,
      file.size,
      metadata,
    );

    const fileUrl = await this.getFileUrl(fullFileName);
    return fileUrl;
  }

  async getFileUrl(fileName: string) {
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${fileName}`;
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async updateArrayImage(
    bucketName: string,
    file: Express.Multer.File,
    imageIndex: number,
  ): Promise<string> {
    const objectName = `images/${imageIndex}-${file.originalname}`;

    try {
      // Xóa file cũ nếu tồn tại trước khi cập nhật
      await this.minioClient.removeObject(bucketName, objectName);

      // Upload file mới
      await this.minioClient.putObject(
        bucketName,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      return objectName; // Trả về đường dẫn của hình ảnh đã cập nhật
    } catch (error) {
      throw new Error(
        `Error updating file at index ${imageIndex}: ${error.message}`,
      );
    }
  }
}
