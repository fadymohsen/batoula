import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createFawaterakInvoice } from '@/lib/fawaterak';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, planSlug } = body;

    if (!customerName || !customerEmail || !customerPhone || !planSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create order with PENDING status
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod: 'FAWATERAK',
        planId: plan.id,
        status: 'PENDING',
      },
    });

    // Get the base URL for redirects
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://coachbatoula.com';

    // Create Fawaterak invoice
    const { invoiceId, paymentUrl } = await createFawaterakInvoice({
      customerName,
      customerEmail,
      customerPhone,
      planTitle: plan.titleEn || plan.title,
      amount: plan.price,
      orderId: order.id,
      redirectUrl: origin,
    });

    // Update order with Fawaterak data
    await prisma.order.update({
      where: { id: order.id },
      data: {
        fawaterakInvoiceId: invoiceId,
        fawaterakPaymentUrl: paymentUrl,
      },
    });

    return NextResponse.json({ paymentUrl, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}
