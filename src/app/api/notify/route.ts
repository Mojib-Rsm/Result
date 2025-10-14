
import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendBulkSms } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, type, recipient, recipients } = body;

    if (!message || !type) {
      return NextResponse.json({ success: false, error: 'Missing message or type' }, { status: 400 });
    }

    if (type === 'telegram') {
      const result = await sendTelegramNotification(message);
      if (result.success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
    } else if (type === 'sms') {
      const targetRecipient = recipient || process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER;
      if (!targetRecipient) {
         return NextResponse.json({ success: false, error: 'Recipient not specified and admin phone number is not configured' }, { status: 400 });
      }
      const result = await sendBulkSms([targetRecipient], message);
      if (result.success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
    } else if (type === 'sms-bulk') {
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return NextResponse.json({ success: false, error: 'Recipients array is missing or empty for sms-bulk' }, { status: 400 });
        }
        const result = await sendBulkSms(recipients, message);
        if (result.success) {
            return NextResponse.json({ success: true, message: "Bulk SMS process initiated." });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    }
    else {
      return NextResponse.json({ success: false, error: 'Invalid notification type' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Notification API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
