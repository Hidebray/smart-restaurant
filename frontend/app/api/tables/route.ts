import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lấy danh sách bàn
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        tableNumber: 'asc' // Sắp xếp theo số bàn tăng dần
      }
    });
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tables' }, { status: 500 });
  }
}

// Tạo bàn mới (Dành cho Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, capacity } = body;

    const newTable = await prisma.table.create({
      data: {
        tableNumber,
        capacity: Number(capacity),
        qrToken: `token-${tableNumber}-${Date.now()}` // Tạm thời generate token đơn giản
      }
    });

    return NextResponse.json(newTable);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating table' }, { status: 500 });
  }
}