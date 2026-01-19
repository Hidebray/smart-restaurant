import { Controller, Get, Post, Body, UseGuards, Query, Delete, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    async findAll(@Query('role') role?: UserRole) {
        if (role) {
            return this.userService.findAll({
                where: { role },
            });
        }
        return this.userService.findAll({});
    }

    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const { password, ...result } = await this.userService.createUser({
            ...createUserDto,
            password: hashedPassword,
        });
        return result;
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const { password, ...result } = await this.userService.updateUser(id, updateUserDto);
        return result;
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        const { password, ...result } = await this.userService.deleteUser(id);
        return result;
    }
}
