import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditlogService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.auditLog.findMany({
      select: {
        id: true,
        model: true,
        action: true,
        data: true,
        user: {
          select: {
            email: true,
          },
        },
        createdAt: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.auditLog.delete({
      where: { id },
    });
  }
}
