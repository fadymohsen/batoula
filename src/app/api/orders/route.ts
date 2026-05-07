import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, paymentMethod, planId, receiptUrl } = body;

    if (!customerName || !customerEmail || !customerPhone || !paymentMethod || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine status based on payment method
    // In a real app, CREDIT_CARD would be PENDING until Stripe webhook confirms
    // But for this mockup, we'll set manual to PENDING and CC to COMPLETED or PENDING
    const status = paymentMethod === 'CREDIT_CARD' ? 'COMPLETED' : 'PENDING';

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
