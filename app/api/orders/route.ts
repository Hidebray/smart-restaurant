
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { OrderStatus } from '../../../types';

/**
 * @swagger
 * /api/orders:
 *   get:
 *     description: Returns the list of all orders
 *     responses:
 *       200:
 *         description: A list of orders with their items.
 */
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json({ error: "Unable to fetch orders" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/orders:
 *   post:
 *     description: Creates a new order
 *     responses:
 *       201:
 *         description: The newly created order.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tableId, items, totalPrice } = body;

        if (!tableId || !items || items.length === 0) {
            return NextResponse.json({ error: "Missing required fields: tableId, items" }, { status: 400 });
        }

        // Using a relational create to ensure atomicity
        const newOrder = await prisma.order.create({
            data: {
                tableId,
                totalPrice,
                status: OrderStatus.PENDING,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error("Failed to create order:", error);
        return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
    }
}
