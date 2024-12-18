import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaClient],
})
export class CategoryModule {}
