// src/event/event.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../auth/sendemail.service';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'Get events of week' })
  @ApiResponse({ status: 200, description: 'Events fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  //lấy event theo tuần
  @Get('week')
  async getEventsByWeek(
    @Query('week') week: number,
    @Query('year') year: number,
  ) {
    return this.eventService.getEventsByWeek(week, year);
  }

  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    description: 'Data for creating a event',
    type: CreateEventDto,
  })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // thêm event
  @Post()
  //@UseGuards(JwtAuthGuard)
  async createEvent(@Req() req, @Body() createEventDto: any) {
    if (createEventDto.recurring !== undefined) {
      createEventDto.recurring = createEventDto.recurring === 'true';
    }
    // lấy thông tin người dùng
    const subscriber = await this.eventService.checkSubscriberFollowAll();
    // tạo event
    const event = await this.eventService.createEvent(createEventDto);
    // kieemr tra xem người dùng có theo dõi sự kiện không
    if (subscriber) {
      for (const subs of subscriber) {
        try {
          await this.emailService.sendemail(subs.email, event.data.id);
        } catch (error) {
          console.error(`Failed to send email to ${subs.email}:`, error);
        }
      }
    }
    return event;
  }

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Events fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // lấy tất cả event
  @Get()
  //@UseGuards(JwtAuthGuard)
  async getAll(@Query() query: any) {
    return this.eventService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a event by ID' })
  @ApiResponse({ status: 200, description: 'Event fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // lấy event theo id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEventById(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a event by ID' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // cập nhật event
  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    if (updateEventDto.recurring !== undefined) {
      updateEventDto.recurring = updateEventDto.recurring === true;
    }
    return this.eventService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete a event by ID' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // xóa event
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Get(':id')
  getEventbyId(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }
}
