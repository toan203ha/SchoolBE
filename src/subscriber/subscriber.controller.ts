import { Controller, Post, Get, Param, Req, Patch, Delete, BadRequestException } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../auth/sendemail.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Subscribers')
@Controller('subscribers')
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly JwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'Create a new subscriber' })
  @ApiConsumes('application/x-www-form-urlencoded')
  
  @ApiResponse({ status: 201, description: 'Subscriber created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // tạo thông tin đăng ký tham gia sự kiện
  @Post(':eventId/')
  async createSubscription(@Req() req: Request, @Param('eventId') eventId: string) {
    // Lấy thông tin từ request (được AuthMiddleware gắn vào)
    const userId = req['userId'];
    const email = req['email'];
    console.log("user: "+userId);
    console.log("email: "+email);

    // Kiểm tra thông tin có hợp lệ không
    if (!userId || !email) {
      throw new BadRequestException('Invalid user information from middleware');
    }

    // Tạo DTO từ thông tin nhận được
    const createSubscriberDto: CreateSubscriberDto = {
      userId,
      eventId,
      email,
    };

    // Gọi service để xử lý đăng ký
    const success = await this.subscriberService.createSubscription(createSubscriberDto, eventId);

    if (!success) {
      throw new BadRequestException('Failed to create subscription');
    }

    // Gửi email nếu đăng ký thành công
    if (email && success.success === true) {
      await this.emailService.sendemail(email, eventId);
    }

    return success;
  }

  @ApiOperation({ summary: 'Get events of subcribers' })
  @ApiResponse({ status: 200, description: 'subcriber fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':eventId')
  async getEventSubscriptions(@Param('eventId') eventId: string) {
    return this.subscriberService.getSubscriptionsByEvent(eventId);
  }

  // cập nhật trạng thái user tham gia nhận toàn bộ thông báo
  @Patch()
  @ApiOperation({ summary: '  create subs to earn all inform' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({ status: 201, description: 'create successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateUserSub(@Req() req) {
    const token = req.cookies['jwt'];
    const decodedUser = this.JwtService.decode(token) as {
      id: string;
      email: string;
    };
    return this.subscriberService.updateSubscriptionUser(decodedUser.id);
  }

  // đếm số người tham gia sự kiện
  @Get('count/:eventId')
  @ApiOperation({ summary: 'Count the number of subscribers' })
  @ApiResponse({ status: 200, description: 'Counted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async countSubscribers(@Param('eventId') eventId: string) {
    return this.subscriberService.countSubscribers(eventId);
  }

  // xóa subriber và subriberEvent
  @Delete('delete/:eventId')
  @ApiOperation({ summary: 'Delete a event by ID' })
  @ApiResponse({ status: 200, description: 'subriberEvent deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async DeleteSubscription(@Req() req, @Param('subID') subID: string) {
    const token = req.cookies['jwt'];
    const decodedUser = this.JwtService.decode(token) as {
      id: string;
      email: string;
    };
    return this.subscriberService.deleteSubscription(subID,decodedUser.email);
  }

  // cancel subriberEvent
  @Delete('cancel/:subid')
  @ApiOperation({ summary: 'Delete a subriberEvent by ID' })
  @ApiResponse({ status: 200, description: 'subriberEvent canceled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async DeleteSubscriptionEvent(@Req() req, @Param('subid') subid: string) {
    return this.subscriberService.deleteSubscriptionEvent(subid);
  }

}
