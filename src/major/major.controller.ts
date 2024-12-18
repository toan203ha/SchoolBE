import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MajorService } from './major.service';

import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { MinioProvider } from '../minio/minio.provider';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@ApiTags('Major')
@Controller('major')
export class MajorController {
  constructor(
    private readonly majorService: MajorService,
    private readonly minioProvider: MinioProvider,
  ) {}

  @ApiOperation({ summary: 'Create a new major with details' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'The data for creating a major and its details, including images',
    type: CreateMajorDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Major and MajorDetail created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 }, // Adjust maxCount as needed
    ]),
  )
  async create(
    @Body() CreateMajorDto: CreateMajorDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    const uploadCV = files.image
      ? await this.minioProvider.uploadFile(files.image[0])
      : null;

    const uploadedImages = files.images
      ? await Promise.all(
          files.images.map((img) => this.minioProvider.uploadFile(img)),
        )
      : [];

    return this.majorService.create(CreateMajorDto, uploadCV, uploadedImages);
  }

  //update
  @ApiOperation({ summary: 'Update major details, including images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'The data for updating a major and its details, including selective image updates',
    type: UpdateMajorDto, // Ensure you have an UpdateMajorDto for this
  })
  @ApiResponse({
    status: 200,
    description: 'Major and MajorDetail updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 }, // Adjust maxCount as needed
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    let uploadCV;

    // Xử lý file ảnh đơn lẻ
    if (files.image && files.image.length > 0) {
      uploadCV = await this.minioProvider.uploadFile(files.image[0]);
    }

    let updatedImagePath: string | null = null;

    // Chỉ xử lý hình ảnh tại vị trí chỉ định
    if (files.images && files.images.length > 0) {
      const imageIndex = parseInt(updateMajorDto.imageIndices as string, 10);

      if (isNaN(imageIndex) || imageIndex < 0) {
        throw new BadRequestException(
          'imageIndices phải là một số nguyên hợp lệ',
        );
      }

      const bucketName = this.minioProvider.bucketName;
      const selectedImage = files.images[0]; // Lấy hình ảnh đầu tiên trong mảng để cập nhật

      updatedImagePath = await this.minioProvider.updateArrayImage(
        bucketName,
        selectedImage,
        imageIndex,
      );
    }

    // Cập nhật thông tin ngành học
    return this.majorService.update(
      id,
      updateMajorDto,
      uploadCV,
      updatedImagePath ? [updatedImagePath] : [],
    );
  }

  @ApiOperation({ summary: 'Get all majors with details' })
  @ApiResponse({
    status: 200,
    description: 'Majors and MajorDetails fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  findAll(@Query() query: any) {
    return this.majorService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a major by ID with details' })
  @ApiResponse({
    status: 200,
    description: 'Major and MajorDetail fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.majorService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a major by ID along with details' })
  @ApiResponse({
    status: 200,
    description: 'Major and MajorDetail deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.majorService.remove(id);
  }
}
