import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AdminProductsQueryDto } from './dto/admin-products-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.productsService.search(query || '');
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(@Query() q: AdminProductsQueryDto) {
    return this.productsService.findAllAdmin(q);
  }

  // ✅ Upload multiple images (admin)
  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
          cb(null, unique);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only JPEG/PNG/WEBP images are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB each
    }),
  )
  uploadProductImages(
    @Param('id') productId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('setPrimaryFirst') setPrimaryFirst?: string,
    @Query('replaceAll') replaceAll?: string,
    @Query() q?: any,
  ) {
    const setPrimary = setPrimaryFirst === 'true';
    const replace = replaceAll === 'true';
    return this.productsService.addProductImages(productId, files, {
      setPrimaryFirst: setPrimary,
      replaceAll: replace,
    });
  }

  // ✅ Set an image as primary
  @Patch(':id/images/:imageId/primary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  setPrimaryImage(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.setPrimaryProductImage(productId, imageId);
  }

  // ✅ Delete an image
  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteImage(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteProductImage(productId, imageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/modifier-groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateProductModifierGroups(
    @Param('id') id: string,
    @Body() { modifierGroupIds }: { modifierGroupIds: string[] },
  ) {
    return this.productsService.updateProductModifierGroups(
      id,
      modifierGroupIds,
    );
  }
}
