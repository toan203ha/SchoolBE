import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: createContactDto,
    });
    return {
      success: Boolean(contact),
      data: contact || 'Không tạo được liên hệ!',
    };
  }

  async findAll() {
    const contacts = await this.prisma.contact.findMany();
    return {
      success: Boolean(contacts),
      data: contacts || 'Không tìm thấy liên hệ!',
    };
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: {
        id,
      },
    });
    return {
      success: Boolean(contact),
      data: contact || 'Không tìm thấy liên hệ!',
    };
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.prisma.contact.update({
      where: {
        id,
      },
      data: updateContactDto,
    });
    return {
      success: Boolean(contact),
      data: contact || 'Không cập nhật được liên hệ!',
    };
  }

  async remove(id: string) {
    const contact = await this.prisma.contact.delete({
      where: {
        id,
      },
    });
    return {
      success: Boolean(contact),
      data: contact || 'Không xóa được liên hệ!',
    };
  }
}
