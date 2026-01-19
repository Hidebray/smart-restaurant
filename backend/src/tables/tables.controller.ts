
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  findAll(@Query('waiterId') waiterId?: string) {
    return this.tablesService.findAll(waiterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }

  @Post(':id/generate-qr')
  async generateQrCode(@Param('id') id: string) {
    try {
      const qrCodeDataUrl = await this.tablesService.generateQrCode(id);
      return { qrCodeDataUrl };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post(':id/regenerate-qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async regenerateQrCode(@Param('id') id: string) {
    const qrCodeDataUrl = await this.tablesService.regenerateQrToken(id);
    return { qrCodeDataUrl };
  }

  @Get('by-token/:token')
  findByToken(@Param('token') token: string) {
    return this.tablesService.findByQrToken(token);
  }

  @Post(':id/request-assistance')
  requestAssistance(
    @Param('id') id: string,
    @Body('type') type: 'PAYMENT_CASH' | 'PAYMENT_QR' | 'ASSISTANCE'
  ) {
    return this.tablesService.requestAssistance(id, type);
  }

  @Patch(':id/assign-waiter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  async assignWaiter(
    @Param('id') id: string,
    @Body('waiterId') waiterId: string | null
  ) {
    return this.tablesService.assignWaiter(id, waiterId);
  }
}
