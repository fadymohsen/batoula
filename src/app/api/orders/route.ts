import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, paymentMethod, planId, receiptUrl } = body;

    if (!customerName || !customerEmail || !customerPhone || !paymentMethod || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });

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

    // Send emails (non-blocking)
    if (plan) {
      Promise.allSettled([
        sendOrderConfirmation({
          customerName,
          customerEmail,
          planTitle: plan.title,
          price: plan.price,
        }),
        sendAdminNotification({
          customerName,
          customerEmail,
          customerPhone,
          planTitle: plan.title,
          price: plan.price,
          paymentMethod,
        }),
      ]).catch((err) => console.error('Email sending error:', err));
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
