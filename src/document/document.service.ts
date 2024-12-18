import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPaginatedData } from '../Util/pagination.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  // thêm thông tin mới
  async createDocument(createDocumentDto: CreateDocumentDto) {
    const document = await this.prisma.document.create({
      data: createDocumentDto,
    });
    return {
      success: Boolean(document),
      data: document || 'Không tạo được document!!!',
    };
  }
  // lấy toàn bộ thông tin
  async getDocuments(query: any) {
    const includeOptions = {
      id: true,
      title: true,
      content: true,
      type: true,
      createdAt: true,
    };
    return await getPaginatedData(
      this.prisma,
      query,
      'document',
      includeOptions,
    );
  }
  // xóa thông tin theo id
  async deleteDocument(id: string) {
    const document = await this.prisma.document.delete({
      where: {
        id,
      },
    });
    return {
      success: Boolean(document),
      message: document ? 'xóa thành công doc' : 'Không xóa được document!!!',
      data: document || 'Không xóa được document!!!',
    };
  }
  // cập nhật thông tin
  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.prisma.document.update({
      where: {
        id,
      },
      data: updateDocumentDto,
    });
    return {
      success: Boolean(document),
      data: document || 'Không cập nhật được document!!!',
    };
  }

  // lấy thông tin theo id
  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: {
        id,
      },
    });
    return {
      success: Boolean(document),
      data: document || 'Không tìm thấy document!!!',
    };
  }
}
