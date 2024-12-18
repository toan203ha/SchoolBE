// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { getPaginatedData } from '../Util/pagination.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const { children, name, parentId, ...rest } = data;
    try {
      // Kiểm tra xem tên danh mục cha có dữ liệu hay không
      if (!name) {
        return {
          success: false,
          data: 'Nhập tên danh mục',
        };
      }
      // Kiểm tra xem danh mục cha đã tồn tại theo tên
      let category = await this.prisma.category.findFirst({
        where: { name },
      });
      // Trường hợp chỉ có 1 danh mục (không có children)
      if (!children || children.length === 0) {
        if (category) {
          return {
            success: false,
            data: `Danh muc: '${name}' đã tồn tại`,
          };
        }
        // Nếu danh mục chưa tồn tại, tạo mới
        category = await this.prisma.category.create({
          data: { ...rest, name, parentId: parentId || null },
        });
        return {
          success: true,
          data: { id: category.id, name: category.name },
        };
      }
      // Trường hợp có danh mục con (children)
      if (category) {
        for (const child of children) {
          const existingChild = await this.prisma.category.findFirst({
            where: { name: child.name, parentId: category.id },
          });
          // Nếu danh mục con đã tồn tại, trả về false
          if (existingChild) {
            return {
              success: false,
              data: `Danh mục '${child.name}' đã tồn tại`,
            };
          }
          // Nếu danh mục con chưa tồn tại, tiếp tục tạo danh mục con
          await this.createCategory({ ...child, parentId: category.id });
        }
        return {
          success: true,
          data: { id: category.id, name: category.name },
        };
      }
      // Nếu danh mục cha chưa tồn tại, tạo mới và tiếp tục tạo danh mục con
      category = await this.prisma.category.create({
        data: { ...rest, name, parentId: parentId || null },
      });
      // tạo danh mục con
      for (const child of children) {
        await this.createCategory({ ...child, parentId: category.id });
      }

      return {
        success: true,
        data: { id: category.id, name: category.name },
      };
    } catch (error) {
      return {
        success: false,
        data: `Error: ${error.message}`,
      };
    }
  }

  async getCategories(query: any) {
    const includeOptions = {
      id: true,
      name: true,
      parentId: true,
    };
    const categories = await getPaginatedData(
      this.prisma,
      query,
      'category',
      includeOptions,
    );

    const success = categories.success;
    const totalPages = categories.metadata.totalPages;
    const currentPage = categories.metadata.currentPage;
    const resPerPage = categories.metadata.resPerPage;
    const filteredItemsCount = categories.metadata.filteredItemsCount;
    const itemsCount = categories.metadata.itemsCount;

    // console.log(categories.data);
    if (!categories.data.length) {
      return {
        success: false,
        data: 'Không có danh mục nào',
      };
    }

    const categoryMap = new Map();
    const tree = [];

    // Tạo bản đồ danh mục với children là mảng rỗng
    categories.data.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Xây dựng cấu trúc cây
    categories.data.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        // Nếu không có parentId, thêm vào cây chính
        tree.push(categoryMap.get(category.id));
      }
    });
    return {
      success,
      totalPages,
      currentPage,
      resPerPage,
      filteredItemsCount,
      itemsCount,
      data: tree,
    };
  }

  //tìm kiếm danh mục theo tên
  //mục đích dùng để kiểm tra tên danh mục đã tồn tại hay chưa
  async getCategoryByName(
    name: string,
  ): Promise<{ success: boolean; data: Category[] | string }> {
    const categories = await this.prisma.category.findMany({
      where: { name },
    });

    return {
      success: categories.length > 0,
      data: categories.length > 0 ? categories : 'Không tìm thấy danh mục',
    };
  }
  //tìm danh mục theo id
  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      success: Boolean(category),
      data: category ?? 'không tìm thất danh mục',
    };
  } //update danh mục
  async updateCategory(id: string, data: UpdateCategoryDto) {
    // Xử lý parentId, nếu nó là chuỗi rỗng thì chuyển sang null
    const updatedData = {
      name: data.name,
      isActive: data.isActive,
      parentId: data.parentId ? data.parentId : null, // Chuyển thành null nếu là chuỗi rỗng
    };

    const update = await this.prisma.category.update({
      where: { id },
      data: updatedData,
    });
    return {
      success: Boolean(update),
      data: update ?? 'Cập nhật thất bại',
    };
  }

  //đếm số lượng danh mục
  //mục đích thống kế và kiểm tra nếu số lượng 1 không cho xoá
  async countCategories(): Promise<number> {
    return this.prisma.category.count();
  }

  //xoá danh mục
  async deleteCategory(id: string) {
    const deletedCategory = await this.prisma.category.delete({
      where: { id: id },
    });
    return {
      success: true,
      data: deletedCategory,
    };
  }
  //set trạng thái hiển thị của danh mục
  async setIsActive(id: string, isActive: boolean): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: { isActive },
    });
  }

  // Toggle isActive for a Category
  async toggleIsActive(id: string): Promise<Category> {
    const currentCategory = await this.prisma.category.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!currentCategory) {
      throw new NotFoundException('Category not found');
    }

    const newIsActive = !currentCategory.isActive;

    return this.prisma.category.update({
      where: { id },
      data: { isActive: newIsActive },
    });
  }

  //lấy danh sách post theo category
  async getPostsByCategory(categoryId: string) {
    const data = await this.prisma.post.findMany({
      where: { categoryId, isActive: true },
      include: {
        category: true,
        language: true,
        tags: true,
        slides: true,
      },
    });

    return {
      success: data.length > 0 ? true : false,
      data: data.length > 0 ? data : 'Không tìm thấy bài viết theo danh mục',
    };
  }
}
