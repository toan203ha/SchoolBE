import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { getPaginatedData } from '../Util/pagination.service';

@Injectable()
export class FormService {
  constructor(private readonly prisma: PrismaService) {}

  // Upload file lên Minio và lưu link vào database
  async uploadFile(fileUrl: string, uploadFile: UploadFileDto) {
    const form = await this.prisma.form.create({
      data: {
        ...uploadFile,
        isActive: uploadFile.isActive,
        content: fileUrl, // Lưu link vào cột content
      },
    });

    return {
      success: Boolean(form),
      data: form || 'Không tạo được form!!!',
    };
  }

  // Lấy tất cả các link
  async getAllLinks(query: any) {
    const includeOptions = {
      id: true,
      title: true,
      content: true,
      type: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    };
    // Gọi hàm getPaginatedData với tên model chính xác
    return await getPaginatedData(this.prisma, query, 'form', includeOptions);
  }

  // Tìm kiếm form theo ID
  async getOneLink(id: string) {
    const form = await this.prisma.form.findUnique({
      where: {
        id,
      },
    });

    return {
      success: Boolean(form),
      data: form || 'Không tìm thấy form theo yêu cầu!!!',
    };
  }

  // Xóa form theo ID
  async removeForm(id: string) {
    const form = await this.prisma.form.delete({
      where: {
        id,
      },
    });

    return {
      success: Boolean(form),
      data: form || 'Không xóa được form!!!',
    };
  }

  // Cập nhật form
  async updateForm(id: string, updateFileDto: UpdateFileDto, fileUrl?: string) {
    const { file, ...updateData } = updateFileDto;  
    const dataToUpdate: any = {
      ...updateData,
      ...(fileUrl && { content: fileUrl }),
    };
  
    const updatedForm = await this.prisma.form.update({
      where: { id },
      data: dataToUpdate,
    });
  
    return {
      success: Boolean(updatedForm),
      data: updatedForm || 'Không cập nhật được form!!!',
    };
  }
  
  

}
