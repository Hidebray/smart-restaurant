import { PartialType } from '@nestjs/mapped-types';
import { CreateModifierGroupDto } from './create-modifier-group.dto';

export class UpdateModifierGroupDto extends PartialType(CreateModifierGroupDto) {}
