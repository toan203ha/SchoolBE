import { Controller, Get, Param, Delete } from '@nestjs/common';
import { AuditlogService } from './auditlog.service';

@Controller('auditlog')
export class AuditlogController {
  constructor(private readonly auditlogService: AuditlogService) {}

  @Get()
  findAll() {
    return this.auditlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditlogService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditlogService.remove(id);
  }
}
