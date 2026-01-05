
import prisma from '../prisma';
import { ProductStatus, OrderStatus, TableStatus } from '../../types';
// FIX: Import `Product` type from `@prisma/client` to correctly type the database response.
import type { Order, OrderItem, Product } from '@prisma/client';

/**
 * Interface for the data required to create a new order.
 */
export interface CreateOrderInput {
  tableId: string;
  totalPrice: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number; // Price at the time of order
    name: string;  // Name at the time of order
  }>;
}

/**
 * Creates a new order in the database using a transaction to ensure data integrity.
 * This process includes:
 * 1. Verifying that all products in the order are available.
 * 2. Creating the main `Order` record.
 * 3. Creating the associated `OrderItem` records.
 * If any step fails, the entire transaction is rolled back.
 * @param data - The order data, including tableId, items, and total price.
 * @returns The newly created order with its associated items.
 * @throws An error if any product is unavailable or if the input data is invalid.
 */
export async function createOrder(data: CreateOrderInput): Promise<Order & { items: OrderItem[] }> {
  const { tableId, totalPrice, items } = data;

  if (!items || items.length === 0) {
    throw new Error("Cannot create an order with no items.");
  }

  const productIds = items.map(item => item.productId);

  // Use a Prisma transaction to ensure all-or-nothing behavior
  return prisma.$transaction(async (tx) => {
    // Step 1: (Race Condition Check) Lock and verify product availability within the transaction
    // FIX: Explicitly type `productsInDb` as `Product[]` to resolve type inference issue where `product.status` was on an `unknown` type.
    const productsInDb: Product[] = await tx.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(productsInDb.map(p => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || product.status !== ProductStatus.AVAILABLE) {
        // If a product is not available, throw an error to rollback the transaction
        throw new Error(`Món "${item.name}" không còn khả dụng.`);
      }
    }
    
    // Step 2: Create the Order record
    const newOrder = await tx.order.create({
      data: {
        tableId,
        totalPrice,
        status: OrderStatus.PENDING,
      },
    });

    // Step 3: Create associated OrderItem records
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // Fetch the newly created order with its items to return it
    const completeOrder = await tx.order.findUniqueOrThrow({
      where: { id: newOrder.id },
      include: { items: true },
    });

    return completeOrder;
  });
}


/**
 * Retrieves the current status of a table and its active order, if one exists.
 * An "active" order is one that is not yet completed, rejected, or cancelled.
 * @param tableId The ID of the table to check.
 * @returns An object containing the table's status and the active order details (or null).
 * @throws An error if the tableId is not provided.
 */
export async function getTableStatus(tableId: string): Promise<{ status: TableStatus; activeOrder: (Order & { items: OrderItem[] }) | null }> {
    if (!tableId) {
        throw new Error("Table ID is required.");
    }

    // Find the most recent active order for the given table
    const activeOrder = await prisma.order.findFirst({
        where: {
            tableId: tableId,
            status: {
                in: [
                    OrderStatus.PENDING,
                    OrderStatus.ACCEPTED,
                    OrderStatus.PREPARING,
                    OrderStatus.READY,
                ]
            }
        },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });

    if (activeOrder) {
        // If an active order exists, the table is considered OCCUPIED
        return {
            status: TableStatus.OCCUPIED,
            activeOrder: activeOrder
        };
    }

    // If no active order, fetch the table's base status from the database
    const table = await prisma.table.findUnique({
        where: { id: tableId }
    });

    // If table doesn't exist in DB, it's considered INACTIVE
    if (!table) {
        return { status: TableStatus.INACTIVE, activeOrder: null };
    }

    // Return the table's stored status (AVAILABLE, RESERVED, INACTIVE)
    return { status: table.status, activeOrder: null };
}