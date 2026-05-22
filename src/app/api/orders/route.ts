import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, paymentMethod, planSlug, planId, receiptUrl } = body;

    if (!customerName || !customerEmail || !customerPhone || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find plan by slug or id
    let plan;
    if (planSlug) {
      plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
    } else if (planId) {
      plan = await prisma.plan.findUnique({ where: { id: planId } });
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        planId: plan.id,
        receiptUrl,
        status: 'PENDING',
      },
    });

    // Send emails (non-blocking)
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
