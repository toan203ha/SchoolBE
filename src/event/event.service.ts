// src/event/event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getPaginatedData } from '../Util/pagination.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo mới một sự kiện
  // src/event/event.service.ts
  async createEvent(createEventDto: CreateEventDto) {
    // Kiểm tra tính hợp lệ của ngày
    // createEventDto.validateDates();

    try {
      // Tạo mới một sự kiện
      const event = await this.prisma.event.create({
        data: {
          title: createEventDto.title,
          description: createEventDto.description,
          startDate: createEventDto.startDate,
          endDate: createEventDto.endDate,
          recurring: createEventDto.recurring || false,
          tags: createEventDto.tags,
        },
      });

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không tạo được event!!!',
      };
    }
  }

  // Lấy tất cả sự kiện
  async findAll(query: any) {
    const includeOptions = {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      recurring: true,
    };
    return await getPaginatedData(this.prisma, query, 'event', includeOptions);
  }

  // Lấy sự kiện theo ID
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const dataToUpdate = {
      recurring: updateEventDto.recurring,
      title: updateEventDto.title,
      description: updateEventDto.description || null,
      ...(updateEventDto.startDate && { startDate: updateEventDto.startDate }),
      ...(updateEventDto.endDate && { endDate: updateEventDto.endDate }),
    };

    return this.prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // Xóa sự kiện
  async remove(id: string) {
    const event = await this.prisma.subscriberEvent.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`subscriberEvent with ID ${id} not found`);
    }

    const deletedEvent = await this.prisma.event.delete({
      where: { id },
    });
    return {
      success: Boolean(deletedEvent),
      data: deletedEvent ? 'Xóa subscriberEvent thành công' : 'Không tìm thấy subscriberEvent',
    };
  }

  async getEventsByWeek(weekNumber: number, year: number) {
    const startDate = this.getStartOfWeek(weekNumber, year);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Kết thúc vào cuối tuần

    const events = await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Thêm thông tin về thứ trong tuần cho mỗi sự kiện
    const eventsWithDays = events.map((event) => ({
      ...event,
      day: this.getDayOfWeek(event.startDate), // Thêm thuộc tính day
    }));

    return {
      week: weekNumber,
      year: year,
      startDate: startDate,
      endDate: endDate,
      events: eventsWithDays,
    };
  }

  private getStartOfWeek(weekNumber: number, year: number): Date {
    const firstDayOfYear = new Date(year, 0, 1); // Ngày đầu tiên của năm
    const daysOffset = (weekNumber - 1) * 7; // Tính toán số ngày để đến tuần cần tìm
    const startOfWeek = new Date(firstDayOfYear);
    startOfWeek.setDate(firstDayOfYear.getDate() + daysOffset);

    // Nếu ngày đầu tiên của năm không phải là Chủ nhật, điều chỉnh để tìm ngày đầu tiên của tuần
    const firstDayWeek = startOfWeek.getDay(); // Lấy ngày trong tuần của ngày đầu tiên
    startOfWeek.setDate(startOfWeek.getDate() - firstDayWeek); // Điều chỉnh về Chủ nhật

    return startOfWeek;
  }

  private getDayOfWeek(date: Date): string {
    const days = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ];
    return days[new Date(date).getDay()]; // Lấy chỉ số ngày trong tuần
  }

  async checkSubscriberFollowAll() {
    return this.prisma.user.findMany({
      where: { followEvent: true },
      select: { email: true },
    });
  }

  // lấy thông tin qua id
  async getEventById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }
}
