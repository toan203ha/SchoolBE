import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailService } from '../auth/sendemail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subscribe } from 'diagnostics_channel';

@Injectable()
export class SubscriberService {
  constructor(private readonly prisma: PrismaService, private readonly emailService: EmailService,
  ) { }

  async createSubscription(createSubscriberDto: CreateSubscriberDto, eventId: string) {
    console.log(createSubscriberDto);
    console.log(eventId);
    // Kiểm tra xem user và event có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: createSubscriberDto.userId },
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!user) {
      throw new NotFoundException('Chưa đăng nhập');
    }

    if (!event) {
      throw new NotFoundException('Không tìm thấy sự kiện');
    }

    // Tạo mới subscriber nếu chưa tồn tại
    let subscriber = await this.prisma.subscriber.findUnique({
      where: { email: createSubscriberDto.email },
    });

    if (!subscriber) {
      subscriber = await this.prisma.subscriber.create({
        data: {
          email: createSubscriberDto.email,
          userId: createSubscriberDto.userId,
          isActive: true,
        },
      });
    }

    // Tạo SubscriberEvent để liên kết subscriber với event
    const subscriberEvent = await this.prisma.subscriberEvent.create({
      data: {
        subscriberId: subscriber.id,
        eventId: eventId,
      },
    });

    return {
      success: Boolean(subscriber && subscriberEvent),
      data: subscriberEvent ?? 'Không tạo được subscriber hoặc sự kiện',
    };
  }

  //xóa subriberevent và subscriber
  async deleteSubscription(subscriberId: string, email: string) {
    const findsub = await this.prisma.subscriber.findUnique({
      where: { id: subscriberId,email: email},
    });
    // xóa subriberevent 
    const deleteSubEvent = await this.prisma.subscriberEvent.deleteMany({
      where: { subscriberId: findsub.id },
    });
    if (!deleteSubEvent) {
      return {
        success: Boolean(deleteSubEvent),
        data: 'Không xóa được subscriberEvent',
      };
    }
    // xóa 
    const deleteSub = await this.prisma.subscriber.deleteMany({
      where: { id: findsub.id},
    });
    if (!deleteSub) {
      return {
        success: Boolean(deleteSub),
        data: 'Không xóa được subscriber',
      };
    }
    return {
      success: Boolean(deleteSub) && Boolean(deleteSubEvent),
      data: deleteSub ?? 'Không xóa được subscriber',
    };
  
  }

  //xóa subriberevent 
  async deleteSubscriptionEvent(subscriberId: string) {
    
    // xóa subriberevent 
    const deleteSubEvent = await this.prisma.subscriberEvent.deleteMany({
      where: { id:subscriberId},
    });

    return {
      success: Boolean(deleteSubEvent),
      data: deleteSubEvent ?? 'Không xóa được subscriberEvent',
    };
  }

  async getSubscriptionsByUser(userId: string) {
    return await this.prisma.subscriber.findMany({
      where: { userId },
      include: { events: { include: { event: true } } },
    });
  }

  async getSubscriptionsByEvent(eventId: string) {
    return await this.prisma.subscriber.findMany({
      where: {
        events: { some: { eventId } },
      },
      include: { user: true },
    });
  }

  async updateSubscriptionUser(id: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { followEvent: true },
    });

    return {
      success: Boolean(updatedUser),
      data: updatedUser ?? 'Không cập nhật được trạng thái',
    };
  }
  async countSubscribers(eventId: string) {
    const count = await this.prisma.subscriberEvent.count({
      where: { eventId },
    });
    return {
      success: Boolean(count),
      data: count ?? 'Không tìm thấy số người tham gia',
    }
  }
  // thông báo cho người trước khi sự kiện bắt đầu 1 ngày
  //@Cron(CronExpression.EVERY_12_HOURS)
  async sendEmailsBeforeEvents() {
    console.log('Bắt đầu kiểm tra và gửi email cho sự kiện sắp diễn ra');
    
    // lấy thông tin subscriber
    const subscriberEvents = await this.prisma.subscriberEvent.findMany({});

    // truy vấn subscriber trong subscriberEvents để lấy email trong subscriber
    const subscriberEmails = subscriberEvents.map((s) => s.subscriberId);
    const subscribers = await this.prisma.subscriber.findMany({
      where: {id: { in: subscriberEmails }},
    });
    console.log("akjsaghkjdagd:     "+subscribers.map((s) => s.email));
    // Lấy danh sách sự kiện diễn ra vào ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsTomorrow = await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(tomorrow.setHours(0, 0, 0, 0)), 
          lt: new Date(tomorrow.setHours(23, 59, 59, 999)) 
        }
      },
      include: { subscribers: { include: { subscriber: true } } },
    });
    console.log(eventsTomorrow);
    if (eventsTomorrow.length === 0) {
      console.log('Không có sự kiện nào diễn ra vào ngày mai');
      return;
    }
  
    for (const event of eventsTomorrow) {

      const emails = subscribers.map((s) => s.email);
  
      try {
          emails.map((email) => this.emailService.sendemail(email, event.id))
        console.log(`Đã gửi email: ${emails}`);
        console.log(`Đã gửi email thành công cho sự kiện ${event.id}`);
      } catch (error) {
        console.error(`Lỗi khi gửi email cho sự kiện ${event.id}: ${error.message}`);
      }
    }
  
    console.log('Hoàn thành việc kiểm tra và gửi email');
  }  

  //@Cron(CronExpression.EVERY_10_SECONDS)
  async sendEndEventNotifications() {
    console.log('Bắt đầu kiểm tra và gửi email khi sự kiện kết thúc');

    // Lấy thời gian hiện tại và ngày hôm nay
    const currentDateTime = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lấy danh sách sự kiện đã kết thúc trong ngày hôm nay
    const eventsEndedNow = await this.prisma.event.findMany({
      where: {
        endDate: {
          lt: currentDateTime,
          gte: today,
        },
      },
      include: { subscribers: { include: { subscriber: true } } },
    });

    if (eventsEndedNow.length === 0) {
      console.log('Không có sự kiện nào vừa kết thúc');
      return;
    }

    for (const event of eventsEndedNow) {
      // Lấy email của những người đã đăng ký cho sự kiện vừa kết thúc
      const emails = event.subscribers.map((s) => s.subscriber.email);

      if (emails.length === 0) {
        console.log(`Sự kiện ${event.id} không có người tham gia để gửi thông báo`);
        continue;
      }

      try {
        await Promise.all(
          emails.map((email) => this.emailService.sendemail(email, event.id))

        );
        console.log(`Đã gửi email: ${emails}`);
        console.log(`Đã gửi thông báo kết thúc sự kiện cho sự kiện ${event.id}`);
      } catch (error) {
        console.error(`Lỗi khi gửi email cho sự kiện ${event.id}: ${error.message}`);
      }
    }

    console.log('Hoàn thành việc kiểm tra và gửi email kết thúc sự kiện');
  }

}
