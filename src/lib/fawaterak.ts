const FAWATERAK_API_URL = 'https://app.fawaterk.com/api/v2';

function getApiKey(): string {
  const key = process.env.FAWATERAK_API_KEY;
  if (!key) {
    throw new Error('FAWATERAK_API_KEY environment variable is not set');
  }
  return key;
}

interface CreateInvoiceParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planTitle: string;
  amount: number;
  orderId: string;
  redirectUrl: string;
}

interface FawaterakInvoiceResponse {
  status: string;
  data: {
    invoice_id: number;
    invoice_key: string;
    payment_data: {
      redirectTo: string;
    };
  };
}

export async function createFawaterakInvoice(params: CreateInvoiceParams): Promise<{
  invoiceId: string;
  paymentUrl: string;
}> {
  const apiKey = getApiKey();

  const response = await fetch(`${FAWATERAK_API_URL}/invoiceInitPay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      payment_method_id: 2, // All available methods via Fawaterak
      cartTotal: params.amount.toString(),
      currency: 'USD',
      customer: {
        first_name: params.customerName,
        last_name: '.',
        email: params.customerEmail,
        phone: params.customerPhone,
        address: 'N/A',
      },
      redirectionUrls: {
        successUrl: `${params.redirectUrl}/payment/success?order_id=${params.orderId}`,
        failUrl: `${params.redirectUrl}/payment/failed?order_id=${params.orderId}`,
        pendingUrl: `${params.redirectUrl}/payment/pending?order_id=${params.orderId}`,
      },
      cartItems: [
        {
          name: params.planTitle,
          price: params.amount.toString(),
          quantity: '1',
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Fawaterak API error:', errorText);
    throw new Error(`Fawaterak API error: ${response.status}`);
  }

  const data: FawaterakInvoiceResponse = await response.json();

  return {
    invoiceId: data.data.invoice_id.toString(),
    paymentUrl: data.data.payment_data.redirectTo,
  };
}

export async function verifyFawaterakPayment(invoiceId: string): Promise<{
  status: 'paid' | 'unpaid' | 'expired' | 'failed';
}> {
  const apiKey = getApiKey();

  const response = await fetch(`${FAWATERAK_API_URL}/getInvoiceData/${invoiceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Fawaterak verify error: ${response.status}`);
  }

  const data = await response.json();
  return { status: data.data.invoice_status };
}
