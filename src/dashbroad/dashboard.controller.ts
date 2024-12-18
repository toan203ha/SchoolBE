import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('dashboard')
@ApiTags('Dashboard') // Đổi tên nhóm API tag cho phù hợp với chức năng
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Lấy tổng quan Dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dữ liệu tổng quan Dashboard được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('overview')
  async getDashboardOverview() {
    return await this.dashboardService.getOverview();
  }

  @ApiOperation({ summary: 'Đếm tổng số bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng bài viết được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-post')
  async getCountPost() {
    return this.dashboardService.getCountPost();
  }

  @ApiOperation({ summary: 'Đếm số bài viết trong tuần' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng bài viết trong tuần được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-post-week')
  async getCountPostToWeek() {
    return this.dashboardService.getCountPostThisWeek();
  }

  @ApiOperation({ summary: 'Đếm số bài viết trong tháng' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng bài viết trong tháng được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-post-month')
  async getCountPostToMonth() {
    return this.dashboardService.getCountPostThisMonth();
  }

  @ApiOperation({ summary: 'Đếm số bài viết theo tháng cụ thể' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng bài viết theo tháng được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('post-count-by-month/:month')
  async getPostCountByMonth(@Param('month', ParseIntPipe) month: number) {
    return this.dashboardService.getPostCountBySpecificMonth(month);
  }

  // CATEGORY
  @ApiOperation({ summary: 'Đếm số lượng danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng danh mục được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-category')
  async getCategoryCount() {
    return this.dashboardService.CountCategory();
  }

  // USER
  @ApiOperation({ summary: 'Đếm tổng số người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng người dùng được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-user')
  async getUserCount() {
    return this.dashboardService.CountUser();
  }

  @ApiOperation({ summary: 'Đếm số người dùng đang hoạt động' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng người dùng đang hoạt động được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-active-user')
  async getUserActiveCount() {
    return this.dashboardService.CountUerIsActive();
  }

  @ApiOperation({ summary: 'Đếm số người dùng chưa hoạt động' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng người dùng chưa hoạt động được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get('count-not-active-user')
  async getUserNotActiveCount() {
    return this.dashboardService.CountUserIsNotActive();
  }
}
