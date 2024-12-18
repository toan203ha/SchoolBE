import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioProvider } from '../minio/minio.provider';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('slide')
@ApiTags('Slide')
export class SlideController {
  constructor(
    private readonly slideService: SlideService,
    private readonly minioProvider: MinioProvider,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new slide' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The data for creating a slide, including an image',
    type: CreateSlideDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The slide has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createSlideDto: CreateSlideDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const uploadResult = await this.minioProvider.uploadFile(image);
    return this.slideService.create(createSlideDto, uploadResult);
  }

  @Get()
  @ApiOperation({ summary: 'Get all slides' })
  @ApiResponse({ status: 200, description: 'Slides fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findAll(@Query() query: any) {
    return this.slideService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a slide by ID' })
  @ApiResponse({ status: 200, description: 'Slide fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a slide by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The data for updating a slide, including an image',
    type: UpdateSlideDto,
  })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateSlideDto: UpdateSlideDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const uploadResult = image
      ? await this.minioProvider.uploadFile(image)
      : undefined;
    return this.slideService.update(id, updateSlideDto, uploadResult);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a slide by ID' })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  remove(@Param('id') id: string) {
    return this.slideService.remove(id);
  }
}
