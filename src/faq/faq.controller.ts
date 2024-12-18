import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  Query,
  NotFoundException,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioProvider } from './../minio/minio.provider';
import { JwtService } from '@nestjs/jwt';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(
    private readonly faqService: FaqService,
    private readonly minioProvider: MinioProvider,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'FAQ creation data',
    type: CreateFaqDto,
  })
  @ApiResponse({ status: 201, description: 'FAQ created successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors(FileInterceptor('file'))
  async createFAQ(
    @Body() createFaqDto: CreateFaqDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    try {
      const token =
        req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new InternalServerErrorException('Token not found');
      }
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.id;
      const uploadResult = await this.minioProvider.uploadFile(file);
      return this.faqService.createFAQ(createFaqDto, uploadResult, userId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all FAQs' })
  @ApiResponse({
    status: 200,
    description: 'List of FAQs retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAllFAQ(@Query() query: any) {
    return this.faqService.findAllFAQ(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of an FAQ by ID' })
  @ApiResponse({
    status: 200,
    description: 'FAQ details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  async getFaqById(@Param('id') id: string) {
    const registration = await this.faqService.getFaqById(id);
    if (!registration) {
      throw new NotFoundException('This FAQ does not exist!');
    }
    return registration;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an FAQ by ID' })
  @ApiBody({
    description: 'Update FAQ fields',
    type: UpdateFaqDto,
  })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.updateFAQ(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an FAQ by ID' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  removeFAQ(@Param('id') id: string) {
    return this.faqService.removeFAQ(id);
  }
}
