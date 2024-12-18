import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { query } from 'express';

@ApiTags('Consultation')
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @ApiOperation({ summary: 'Tạo hồ sơ tư vấn mới' })
  @ApiResponse({
    status: 201,
    description: 'Hồ sơ tư vấn đã được tạo thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Post()
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationService.create(createConsultationDto);
  }

  @ApiOperation({ summary: 'Lấy tất cả hồ sơ tư vấn' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách hồ sơ tư vấn đã được lấy thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @Get()
  findAll() {
    return this.consultationService.findAll(query);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một hồ sơ tư vấn' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết của hồ sơ tư vấn đã được lấy thành công.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ tư vấn.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationService.findOne(id);
  }

  @ApiOperation({ summary: 'Cập nhật hồ sơ tư vấn' })
  @ApiResponse({
    status: 200,
    description: 'Hồ sơ tư vấn đã được cập nhật thành công.',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ tư vấn.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    return this.consultationService.update(id, updateConsultationDto);
  }

  @ApiOperation({ summary: 'Xóa hồ sơ tư vấn' })
  @ApiResponse({
    status: 200,
    description: 'Hồ sơ tư vấn đã được xóa thành công.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ tư vấn.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(id);
  }
}
