import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'ar';

  const title = locale === 'ar'
    ? 'كوتش بتولة'
    : 'Coach Batoula';

  const subtitle = locale === 'ar'
    ? 'مدربة تغذية معتمدة ولايف كوتش'
    : 'Certified Nutrition Coach & Life Coach';

  const tagline = locale === 'ar'
    ? 'كلي من أكل بيتك.. وضلّي صحية ورشيقة'
    : 'Eat from home & stay healthy and fit';

  const isRtl = locale === 'ar';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#2c2825',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(180, 138, 102, 0.15)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(196, 107, 107, 0.1)',
            filter: 'blur(60px)',
          }}
        />

        {/* Left side - Image */}
        <div
          style={{
            width: 420,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Rose background circle behind character */}
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'rgba(196, 107, 107, 0.25)',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${searchParams.get('origin') || 'https://coachbatool.com'}/coach-batoula.jpg`}
            alt=""
            width={360}
            height={480}
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
              borderRadius: '24px 24px 0 0',
              position: 'relative',
            }}
          />
        </div>

        {/* Right side - Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 56px 48px 32px',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: 'rgba(180, 138, 102, 0.2)',
                border: '1px solid rgba(180, 138, 102, 0.3)',
                borderRadius: 50,
                padding: '8px 20px',
                fontSize: 14,
                color: '#b48a66',
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {locale === 'ar' ? 'مدربة تغذية معتمدة' : 'CERTIFIED COACH'}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>{title}</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 4,
              background: '#b48a66',
              borderRadius: 4,
              marginBottom: 28,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: '#b48a66',
              fontWeight: 800,
              lineHeight: 1.5,
            }}
          >
            {tagline}
          </div>

          {/* Website URL */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 24,
              fontSize: 16,
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            coachbatool.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
