import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, paymentMethod, planId, receiptUrl } = body;

    if (!customerName || !customerEmail || !customerPhone || !paymentMethod || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // All manual orders start as PENDING (admin confirms after reviewing receipt)
    // Fawaterak payments go through /api/payments/initiate instead
    const status = 'PENDING';

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        planId,
        receiptUrl,
        status,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
