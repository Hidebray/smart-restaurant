import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsOptional()
    displayOrder?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
