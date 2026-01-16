import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModifiersService } from './modifiers.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { CreateModifierOptionDto } from './dto/create-modifier-option.dto';
import { UpdateModifierOptionDto } from './dto/update-modifier-option.dto';

@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}

  // Modifier Groups
  @Post('groups')
  createGroup(@Body() createModifierGroupDto: CreateModifierGroupDto) {
    return this.modifiersService.createGroup(createModifierGroupDto);
  }

  @Get('groups')
  findAllGroups() {
    return this.modifiersService.findAllGroups();
  }

  @Get('groups/:id')
  findOneGroup(@Param('id') id: string) {
    return this.modifiersService.findOneGroup(id);
  }

  @Patch('groups/:id')
  updateGroup(@Param('id') id: string, @Body() updateModifierGroupDto: UpdateModifierGroupDto) {
    return this.modifiersService.updateGroup(id, updateModifierGroupDto);
  }

  @Delete('groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.modifiersService.removeGroup(id);
  }

  // Modifier Options
  @Post('options')
  createOption(@Body() createModifierOptionDto: CreateModifierOptionDto) {
    return this.modifiersService.createOption(createModifierOptionDto);
  }

  @Get('options/:id')
  findOneOption(@Param('id') id: string) {
    return this.modifiersService.findOneOption(id);
  }

  @Patch('options/:id')
  updateOption(@Param('id') id: string, @Body() updateModifierOptionDto: UpdateModifierOptionDto) {
    return this.modifiersService.updateOption(id, updateModifierOptionDto);
  }

  @Delete('options/:id')
  removeOption(@Param('id') id: string) {
    return this.modifiersService.removeOption(id);
  }
}
