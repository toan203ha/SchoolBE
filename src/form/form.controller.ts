import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Body,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormService } from './form.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { MinioProvider } from '../minio/minio.provider';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('form')
@ApiTags('Form')
export class FormController {
  constructor(
    private readonly minioService: FormService,
    private readonly minioProvider: MinioProvider,
  ) {}

  // Upload biểu mẫu
  @ApiOperation({ summary: 'Upload a new file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for uploading a file',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: any,
  ) {
    if (uploadFileDto.isActive !== undefined) {
      uploadFileDto.isActive = uploadFileDto.isActive === 'true';
    }
    const data = await this.minioProvider.uploadFile(file);
    return this.minioService.uploadFile(data, uploadFileDto);
  }

  // Lấy tất cả biểu mẫu
  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({ status: 200, description: 'Forms fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  getAllLinks(@Query() query: any) {
    return this.minioService.getAllLinks(query);
  }

  // Lọc biểu mẫu theo ID yêu cầu
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiResponse({ status: 200, description: 'Form fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.minioService.getOneLink(id);
  }

  // Xóa biểu mẫu
  @ApiOperation({ summary: 'Delete a form by ID' })
  @ApiResponse({ status: 200, description: 'Form deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.minioService.removeForm(id);
  }

  // Chỉnh sửa biểu mẫu
// Chỉnh sửa biểu mẫu
@ApiOperation({ summary: 'Update a form by ID' })
@ApiConsumes('multipart/form-data')
@ApiBody({ description: 'Updated data for the form', type: UpdateFileDto })
@ApiResponse({ status: 200, description: 'Form updated successfully' })
@ApiResponse({ status: 400, description: 'Bad request' })
@Patch(':id')
@UseInterceptors(FileInterceptor('file'))
async updateForm(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() uploadFileDto: any,
) {
  if (uploadFileDto.isActive !== undefined) {
    uploadFileDto.isActive = uploadFileDto.isActive === 'true';
  }

  // Kiểm tra nếu có file mới để upload
  let data;
  if (file) {
    data = await this.minioProvider.uploadFile(file);
  }

  // Gửi data (có hoặc không có file mới) để cập nhật form
  return this.minioService.updateForm(id, uploadFileDto, data);
}

}
