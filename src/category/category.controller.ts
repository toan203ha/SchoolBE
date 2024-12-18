// category.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  BadRequestException,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    description: 'Data for creating a category',
    type: CreateCategoryDto,
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  //@UseGuards(JwtAuthGuard)
  create(@Body() data: any) {
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true';
    }
    return this.categoryService.createCategory(data);
  }

  @ApiOperation({ summary: 'Get all category' })
  @ApiResponse({ status: 200, description: 'Category fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  //@UseGuards(JwtAuthGuard)
  findAll(@Query() query: any) {
    return this.categoryService.getCategories(query);
  }

  @ApiOperation({ summary: 'Delete a Category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  // Delete Category by ID
  @Delete('delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
  // Set isActive for a Category
  @Patch(':id/isActive')
  setIsActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Category> {
    return this.categoryService.setIsActive(id, isActive);
  }

  // Toggle isActive for a Category
  @Patch(':id/toggleIsActive')
  async toggleIsActive(@Param('id') id: string): Promise<Category> {
    const countCategory = await this.categoryService.countCategories();
    if (countCategory <= 1) {
      throw new BadRequestException(
        'Không thể xoá vì phải có ít nhất một danh mục',
      );
    }
    return this.categoryService.toggleIsActive(id);
  }
  @ApiOperation({ summary: 'Update a Category by ID' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  //@UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateDocument(@Param('id') id: string, @Body() data: any) {
    // Chuyển đổi `isActive` sang boolean
    if (data.isActive !== undefined) {
      data.isActive = data.isActive === 'true';
    }
    return this.categoryService.updateCategory(id, data);
  }

  @ApiOperation({ summary: 'Get all category' })
  @ApiResponse({ status: 200, description: 'Category fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // Get Category by ID
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Get List Post by CategoryId' })
  @ApiResponse({ status: 200, description: 'Category fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // lấy post thông qua category
  @Get('post/:categoryId')
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.getPostsByCategory(categoryId);
  }
}
