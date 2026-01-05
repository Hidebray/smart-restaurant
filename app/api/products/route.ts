
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { ProductStatus } from '../../../types';

/**
 * @swagger
 * /api/products:
 *   get:
 *     description: Returns the list of all products
 *     responses:
 *       200:
 *         description: A list of products.
 */
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Unable to fetch products" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     description: Creates a new product
 *     responses:
 *       201:
 *         description: The newly created product.
 */
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, description, price, categoryId, imageUrl } = data;

        if (!name || !price || !categoryId) {
            return NextResponse.json({ error: "Missing required fields: name, price, categoryId" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId,
                imageUrl: imageUrl || 'https://picsum.photos/seed/default/400/300',
                status: ProductStatus.AVAILABLE,
            },
        });
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json({ error: "Unable to create product" }, { status: 500 });
    }
}
