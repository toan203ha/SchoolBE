import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  //1. Hàm lấy số liệu tổng quan
  async getOverview() {
    const postCount = await this.prisma.post.count();
    const documentCount = await this.prisma.document.count();
    const registrationCount = await this.prisma.registration.count();
    const notificationCount = await this.prisma.student.count(); // ví dụ số thông báo sinh viên

    // Thống kê lượng truy cập (giả sử có lưu lượng truy cập)
    const traffic = await this.prisma.user.count({
      where: { isActive: true },
    });
    return {
      traffic: traffic,
      registrations: registrationCount,
      posts: postCount,
      documents: documentCount,
      notifications: notificationCount,
    };
  }

  //POST
  //đếm tông số bài viết
  async getCountPost() {
    const getCountPost = await this.prisma.post.count();
    return {
      success: Boolean(getCountPost),
      data: getCountPost ?? 'không đếm được danh sách',
    };
  }

  //đếm tổng bài viết trong tháng này
  async getCountPostThisMonth() {
    //lấy ngày đầu tháng và ngày ngày tháng hiện tại
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const Daynow = new Date();

    const countPostsThisMonth = await this.prisma.post.count({
      where: {
        createdAt: {
          gte: startOfMonth, //lớn hơn hoặc bàng ngày đầu tháng
          lte: Daynow, //nhỏ hơn hoặc bàng ngày hiện tại
        },
      },
    });

    return {
      success: Boolean(countPostsThisMonth),
      data: countPostsThisMonth ?? 'không đếm được danh sách',
    };
  }
  // đếm tổng bài viết trong tuần
  async getCountPostThisWeek() {
    // Lấy ngày đầu tuần (thứ 2) và ngày hiện tại
    const currentDate = new Date();
    const firstDayOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1),
    ); // Thứ 2

    const now = new Date();

    const countPostsThisWeek = await this.prisma.post.count({
      where: {
        createdAt: {
          gte: firstDayOfWeek, // Lớn hơn hoặc bằng ngày đầu tuần
          lte: now, // Nhỏ hơn hoặc bằng ngày hiện tại
        },
      },
    });

    return {
      success: Boolean(countPostsThisWeek),
      data: countPostsThisWeek ?? 'không đếm được danh sách',
    };
  }

  // nhận tháng cần lấy và sẽ xuất ra các bài post trong tháng đó
  async getPostCountBySpecificMonth(month: number) {
    const currentYear = new Date().getFullYear();

    // Kiểm tra xem tháng nhập có hợp lệ không (phải từ 1 đến 12)
    if (month < 1 || month > 12) {
      return {
        success: false,
        message: 'Tháng không hợp lệ. Vui lòng nhập giá trị từ 1 đến 12.',
      };
    }

    // Lấy ngày bắt đầu và kết thúc của tháng
    const startOfMonth = new Date(currentYear, month - 1, 1); // Ngày đầu tháng
    const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59); // Ngày cuối tháng

    // Đếm số lượng bài post trong khoảng thời gian đó
    const countPosts = await this.prisma.post.count({
      where: {
        createdAt: {
          gte: startOfMonth, // Ngày lớn hơn hoặc bằng đầu tháng
          lte: endOfMonth, // Ngày nhỏ hơn hoặc bằng cuối tháng
        },
      },
    });

    return {
      success: true,
      month,
      count: countPosts,
    };
  }

  //CATEGOGY
  // đếm category

  async CountCategory() {
    const countCategory = await this.prisma.category.count();
    return {
      success: countCategory >= 0, // Kiểm tra số lượng danh mục
      data: countCategory > 0 ? countCategory : 'Không tìm thấy danh mục',
    };
  }

  //User
  //ĐẾM USER
  async CountUser() {
    const countUser = await this.prisma.user.count();
    return {
      success: countUser >= 0, // Kiểm tra số lượng người dùng
      data: countUser > 0 ? countUser : 'Không tìm thấy user',
    };
  }

  //ĐẾM USER ĐÃ ACTIVE
  async CountUerIsActive() {
    const countuser = await this.prisma.user.count({
      where: { isActive: true },
    });
    return {
      success: Boolean(countuser),
      data: countuser ?? 'Không tìm thấy user',
    };
  }

  //ĐẾM USER CHƯA ACTIVE
  async CountUserIsNotActive() {
    const countuser = await this.prisma.user.count({
      where: { isActive: false },
    });
    return {
      success: Boolean(countuser),
      data: countuser ?? 'Không tìm thấy user',
    };
  }
}
