import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Coach Batoula <noreply@coachbatool.com>';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://coachbatool.com';
const WHATSAPP_URL = 'https://wa.me/';
const INSTAGRAM_URL = 'https://www.instagram.com/batool.home?igsh=MXhnY3R5eDh0d20wcQ==';
const FACEBOOK_URL = 'https://www.facebook.com/share/1HAy8RGqgV/';
const TIKTOK_URL = 'https://www.tiktok.com/@batool_home?_r=1&_t=ZN-95w9fa2xqyZ';
const YOUTUBE_URL = 'https://youtube.com/@batoolhome6303?si=1u2ZLkH4PhLCTd30';

// Branded email wrapper
function emailLayout(body: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f5f1eb; font-family: 'Segoe UI', Arial, sans-serif;">
<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 0;">

  <!-- HEADER -->
  <div style="background: #2c2825; padding: 40px 32px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">Coach Batoula</h1>
    <p style="color: #b48a66; margin: 8px 0 0; font-size: 13px; font-weight: 600;">مدربة تغذية معتمدة ولايف كوتش</p>
  </div>

  <!-- BODY -->
  <div style="padding: 40px 32px 32px;">
    ${body}

    <!-- WEBSITE & WHATSAPP CTAs (inside body, after content) -->
    <div style="text-align: center; margin-top: 32px; padding-top: 28px; border-top: 1px solid #f0eadd;">
      <a href="${SITE_URL}" style="display: inline-block; background: #2c2825; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 6px 10px;">
        زوري موقعنا 🌐
      </a>
      <a href="${WHATSAPP_URL}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 6px 10px;">
        تواصلي واتساب 💬
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background: #faf8f5; padding: 28px 32px; text-align: center; border-top: 1px solid #f0eadd;">
    <p style="color: #b48a66; font-size: 12px; margin: 0 0 20px; font-weight: 700;">صحة وألف هنا.. على قلبك وقلب عيلتك! 💚</p>

    <!-- SOCIAL MEDIA ICONS -->
    <div style="margin-bottom: 16px;">
      <a href="${INSTAGRAM_URL}" style="display: inline-block; margin: 0 6px; text-decoration: none;" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="28" height="28" style="border: 0; display: inline-block; vertical-align: middle;" />
      </a>
      <a href="${FACEBOOK_URL}" style="display: inline-block; margin: 0 6px; text-decoration: none;" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" width="28" height="28" style="border: 0; display: inline-block; vertical-align: middle;" />
      </a>
      <a href="${TIKTOK_URL}" style="display: inline-block; margin: 0 6px; text-decoration: none;" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" width="28" height="28" style="border: 0; display: inline-block; vertical-align: middle;" />
      </a>
      <a href="${YOUTUBE_URL}" style="display: inline-block; margin: 0 6px; text-decoration: none;" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" alt="YouTube" width="28" height="28" style="border: 0; display: inline-block; vertical-align: middle;" />
      </a>
    </div>

    <!-- COPYRIGHT -->
    <div style="border-top: 1px solid #e8dfd1; padding-top: 14px;">
      <p style="color: #c4b8a9; font-size: 11px; margin: 0;">
        <a href="${SITE_URL}" style="color: #8a7f76; text-decoration: none;">coachbatool.com</a>
        &nbsp;•&nbsp;
        <a href="mailto:info@coachbatool.com" style="color: #8a7f76; text-decoration: none;">info@coachbatool.com</a>
      </p>
      <p style="color: #d4ccc0; font-size: 10px; margin: 8px 0 0;">© ${new Date().getFullYear()} Coach Batoula. All rights reserved.</p>
    </div>
  </div>

</div>
</body>
</html>`;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

export async function sendOrderConfirmation({
  customerName,
  customerEmail,
  planTitle,
  price,
}: {
  customerName: string;
  customerEmail: string;
  planTitle: string;
  price: number;
}) {
  return sendEmail({
    to: customerEmail,
    subject: `تأكيد الطلب - ${planTitle} | Coach Batoula`,
    html: emailLayout(`
      <h2 style="color: #2c2825; margin-top: 0; font-size: 22px;">مرحباً ${customerName} 👋</h2>
      <p style="color: #6b625a; font-size: 16px; line-height: 1.8;">
        تم استلام طلبك بنجاح! رح نتواصل معك قريباً على الواتساب لنبدأ الرحلة.
      </p>

      <div style="background: #faf8f5; border-radius: 16px; padding: 24px; margin: 28px 0; border: 1px solid #f0eadd;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #8a7f76; font-size: 14px; border-bottom: 1px solid #e8dfd1;">الباقة</td>
            <td style="padding: 12px 0; color: #2c2825; font-weight: bold; text-align: left; font-size: 16px; border-bottom: 1px solid #e8dfd1;">${planTitle}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #8a7f76; font-size: 14px; border-bottom: 1px solid #e8dfd1;">المبلغ</td>
            <td style="padding: 12px 0; color: #b48a66; font-weight: bold; text-align: left; font-size: 20px; border-bottom: 1px solid #e8dfd1;">$${price}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #8a7f76; font-size: 14px;">الحالة</td>
            <td style="padding: 12px 0; text-align: left;">
              <span style="display: inline-block; background: #FFF3CD; color: #856404; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold;">بانتظار التأكيد</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #2c2825; border-radius: 16px; padding: 24px; text-align: center; margin-top: 24px;">
        <p style="color: #b48a66; font-size: 14px; margin: 0 0 4px; font-weight: bold;">الخطوة القادمة</p>
        <p style="color: #ffffff; font-size: 15px; margin: 0; line-height: 1.7;">
          رح نتواصل معك على الواتساب خلال ١٢ ساعة كحد أقصى لنحدد موعد أول اتصال ونبدأ نرسم خطتك!
        </p>
      </div>
    `),
  });
}

export async function sendBookPurchaseEmail({
  customerName,
  customerEmail,
  bookDownloadUrl,
}: {
  customerName: string;
  customerEmail: string;
  bookDownloadUrl?: string;
}) {
  return sendEmail({
    to: customerEmail,
    subject: 'كتابك جاهز - تقليدية بس صحية | Coach Batoula',
    html: emailLayout(`
      <h2 style="color: #2c2825; margin-top: 0; font-size: 22px;">مرحباً ${customerName} 👋</h2>
      <p style="color: #6b625a; font-size: 16px; line-height: 1.8;">
        شكراً لشرائك كتاب <strong>"تقليدية بس صحية"</strong>! 🎉
      </p>

      ${bookDownloadUrl ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${bookDownloadUrl}" style="display: inline-block; background: #b48a66; color: white; padding: 18px 40px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 16px rgba(180,138,102,0.3);">
          حمّلي الكتاب الآن 📖
        </a>
      </div>
      ` : `
      <div style="background: #faf8f5; border-radius: 16px; padding: 24px; margin: 28px 0; border: 1px solid #f0eadd; text-align: center;">
        <p style="color: #6b625a; font-size: 16px; line-height: 1.8; margin: 0;">
          رح نرسلك رابط التحميل قريباً بعد تأكيد الدفع ⏳
        </p>
      </div>
      `}

      <div style="background: #2c2825; border-radius: 16px; padding: 24px; text-align: center; margin-top: 24px;">
        <p style="color: #b48a66; font-size: 14px; margin: 0 0 4px; font-weight: bold;">بالكتاب رح تلاقي</p>
        <p style="color: #ffffff; font-size: 15px; margin: 0; line-height: 1.7;">
          وصفات بيتية صحية محسوبة السعرات والماكروز — كلي من أكل بيتك وضلّي رشيقة!
        </p>
      </div>
    `),
  });
}

export async function sendAdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  planTitle,
  price,
  paymentMethod,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planTitle: string;
  price: number;
  paymentMethod: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@coachbatool.com';

  const paymentLabels: Record<string, string> = {
    INSTAPAY: 'InstaPay',
    BANK_TRANSFER: 'تحويل بنكي',
    PAYPAL: 'PayPal',
  };

  return sendEmail({
    to: adminEmail,
    subject: `🔔 طلب جديد - ${planTitle} من ${customerName}`,
    html: emailLayout(`
      <div style="background: #b48a66; border-radius: 12px; padding: 16px 24px; margin-bottom: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">🔔 طلب اشتراك جديد</h2>
      </div>

      <div style="background: #faf8f5; border-radius: 16px; padding: 24px; border: 1px solid #f0eadd;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold; border-bottom: 1px solid #e8dfd1; width: 120px;">الاسم</td>
            <td style="padding: 14px 12px; color: #2c2825; font-weight: bold; font-size: 15px; border-bottom: 1px solid #e8dfd1;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold; border-bottom: 1px solid #e8dfd1;">الإيميل</td>
            <td style="padding: 14px 12px; border-bottom: 1px solid #e8dfd1;">
              <a href="mailto:${customerEmail}" style="color: #2c2825; text-decoration: none;">${customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold; border-bottom: 1px solid #e8dfd1;">الهاتف</td>
            <td style="padding: 14px 12px; border-bottom: 1px solid #e8dfd1;">
              <a href="https://wa.me/${customerPhone.replace(/[\s\-\+]/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${customerPhone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold; border-bottom: 1px solid #e8dfd1;">الباقة</td>
            <td style="padding: 14px 12px; color: #2c2825; font-weight: bold; font-size: 16px; border-bottom: 1px solid #e8dfd1;">${planTitle}</td>
          </tr>
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold; border-bottom: 1px solid #e8dfd1;">المبلغ</td>
            <td style="padding: 14px 12px; color: #b48a66; font-weight: bold; font-size: 20px; border-bottom: 1px solid #e8dfd1;">$${price}</td>
          </tr>
          <tr>
            <td style="padding: 14px 12px; color: #8a7f76; font-size: 13px; font-weight: bold;">طريقة الدفع</td>
            <td style="padding: 14px 12px;">
              <span style="display: inline-block; background: #e8dfd1; color: #2c2825; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold;">${paymentLabels[paymentMethod] || paymentMethod}</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wa.me/${customerPhone.replace(/[\s\-\+]/g, '')}" style="display: inline-block; background: #25D366; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 6px 10px;">
          تواصلي معها على واتساب 💬
        </a>
        <a href="${SITE_URL}/admin/orders" style="display: inline-block; background: #2c2825; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 6px 10px;">
          عرض الطلبات 📋
        </a>
      </div>
    `),
  });
}
