import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Registration') // Groups the endpoints under "Registration" in Swagger UI
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  // Create a new registration
  @Post()
  @ApiOperation({ summary: 'Create a new registration' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({
    status: 201,
    description: 'Registration created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({
    description: 'Data for registration',
    type: CreateRegistrationDto,
  })
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationService.create(createRegistrationDto);
  }

  // Retrieve all registrations
  @Get()
  @ApiOperation({ summary: 'Retrieve list of all registrations' })
  @ApiResponse({
    status: 200,
    description: 'List of registrations retrieved successfully.',
  })
  findAll(@Query() query: any) {
    return this.registrationService.findAll(query);
  }

  // Retrieve a single registration by ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve registration details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Registration details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  async getRegistrationDetails(@Param('id') id: string) {
    const registration =
      await this.registrationService.getRegistrationDetails(id);
    if (!registration) {
      throw new NotFoundException('Registration not found.');
    }
    return registration;
  }

  // Delete a registration by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a registration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Registration deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  deleteRegistration(@Param('id') id: string) {
    return this.registrationService.deleteRegistration(id);
  }
}
