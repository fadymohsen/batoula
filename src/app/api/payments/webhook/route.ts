import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fawaterak sends: invoice_id, invoice_status, payment_method, etc.
    const { invoice_id, invoice_status } = body;

    if (!invoice_id) {
      return NextResponse.json({ error: 'Missing invoice_id' }, { status: 400 });
    }

    const invoiceIdStr = invoice_id.toString();

    // Find the order by Fawaterak invoice ID
    const order = await prisma.order.findFirst({
      where: { fawaterakInvoiceId: invoiceIdStr },
    });

    if (!order) {
      console.error('Webhook: Order not found for invoice:', invoiceIdStr);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map Fawaterak status to our OrderStatus
    let status: 'COMPLETED' | 'FAILED' | 'PENDING';
    if (invoice_status === 'paid') {
      status = 'COMPLETED';
    } else if (invoice_status === 'failed' || invoice_status === 'expired') {
      status = 'FAILED';
    } else {
      status = 'PENDING';
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
