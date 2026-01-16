import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { CreateModifierOptionDto } from './dto/create-modifier-option.dto';
import { UpdateModifierOptionDto } from './dto/update-modifier-option.dto';

@Injectable()
export class ModifiersService {
  constructor(private prisma: PrismaService) {}

  // Modifier Groups
  createGroup(createModifierGroupDto: CreateModifierGroupDto) {
    return this.prisma.modifierGroup.create({ data: createModifierGroupDto });
  }

  findAllGroups() {
    return this.prisma.modifierGroup.findMany({ include: { options: true } });
  }

  findOneGroup(id: string) {
    return this.prisma.modifierGroup.findUnique({ where: { id }, include: { options: true } });
  }

  updateGroup(id: string, updateModifierGroupDto: UpdateModifierGroupDto) {
    return this.prisma.modifierGroup.update({ where: { id }, data: updateModifierGroupDto });
  }

  removeGroup(id: string) {
    return this.prisma.modifierGroup.delete({ where: { id } });
  }

  // Modifier Options
  createOption(createModifierOptionDto: CreateModifierOptionDto) {
    const { priceAdjustment, ...rest } = createModifierOptionDto;
    return this.prisma.modifierOption.create({
      data: {
        ...rest,
        priceAdjustment: priceAdjustment,
      },
    });
  }

  findOneOption(id: string) {
    return this.prisma.modifierOption.findUnique({ where: { id } });
  }

  updateOption(id: string, updateModifierOptionDto: UpdateModifierOptionDto) {
    const { priceAdjustment, ...rest } = updateModifierOptionDto;
    const data: any = { ...rest };
    if (priceAdjustment) {
      data.priceAdjustment = priceAdjustment;
    }
    return this.prisma.modifierOption.update({ where: { id }, data });
  }

  removeOption(id: string) {
    return this.prisma.modifierOption.delete({ where: { id } });
  }
}
