import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://eboardresults.com/v2/captcha?t=' + Date.now(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CAPTCHA');
    }

    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const imageSrc = `data:image/jpeg;base64,${imageBase64}`;

    const cookie = response.headers.get('set-cookie');

    return NextResponse.json({
      img: imageSrc,
      cookie: cookie || '',
    });
  } catch (error) {
    console.error('CAPTCHA fetch error:', error);
    return new NextResponse('Error fetching CAPTCHA', {status: 500});
  }
}

export const dynamic = 'force-dynamic';
