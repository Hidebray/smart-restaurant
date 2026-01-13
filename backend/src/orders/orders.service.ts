import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {} 

  async create(createOrderDto: CreateOrderDto) {
    const { tableId, items } = createOrderDto;
    
    if (!items?.length) {
      throw new BadRequestException("The order must have at least one item.");
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {id: item.productId},
        });

        if (!product) {
          throw new BadRequestException(`The product with Id ${item.productId} does not exists.`)
        }

        if (product.status !== 'AVAILABLE') {
          throw new BadRequestException(`"${product.name}" is sold out.`)
        }

        const itemPrice = Number(product.price);
        const itemTotal = itemPrice * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: itemPrice,
          totalPrice: itemTotal
        });
      }

      const newOrder = await tx.order.create({
        data: {
          tableId,
          totalAmount,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true},
      });

      return newOrder
    })
  }

  findAll() {
    return this.prisma.order.findMany({ 
      include: { 
          items: { include: {product: true} },
          table: true
      },
      orderBy: {createdAt: 'desc'}
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
