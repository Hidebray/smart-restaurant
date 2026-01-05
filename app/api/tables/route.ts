
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { OrderStatus, TableStatus } from '../../../types';

/**
 * @swagger
 * /api/tables:
 *   get:
 *     description: Returns the list of all tables with their real-time status
 *     responses:
 *       200:
 *         description: A list of tables.
 */
export async function GET() {
    try {
        const tables = await prisma.table.findMany({
            orderBy: { tableNumber: 'asc' },
        });

        const activeOrders = await prisma.order.findMany({
            where: {
                status: {
                    in: [
                        OrderStatus.PENDING,
                        OrderStatus.ACCEPTED,
                        OrderStatus.PREPARING,
                        OrderStatus.READY,
                    ],
                },
            },
            select: {
                tableId: true,
            },
        });

        const activeTableIds = new Set(activeOrders.map(o => o.tableId));

        const tablesWithLiveStatus = tables.map(table => {
            if (activeTableIds.has(table.id)) {
                return { ...table, status: TableStatus.OCCUPIED };
            }
            // If not occupied, return its base status (Available, Reserved, or Inactive)
            return table;
        });

        return NextResponse.json(tablesWithLiveStatus);
    } catch (error) {
        console.error("Failed to fetch tables:", error);
        return NextResponse.json({ error: "Unable to fetch tables" }, { status: 500 });
    }
}
