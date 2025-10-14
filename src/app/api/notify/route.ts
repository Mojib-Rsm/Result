
import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendAnbuSms, sendBulkSmsBd } from '@/lib/sms';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

async function getActiveSmsApi(): Promise<'anbu' | 'bulksmsbd'> {
    try {
        const db = getFirestore(app);
        const settingsRef = doc(db, 'settings', 'config');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists() && settingsSnap.data().activeSmsApi) {
            return settingsSnap.data().activeSmsApi;
        }
    } catch (error) {
        console.error("Error fetching active SMS API from Firestore:", error);
    }
    // Default to 'anbu' if not set or on error
    return 'anbu';
}


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
    } else if (type === 'sms' || type === 'sms-bulk') {
        const numbersToSend: string[] = type === 'sms-bulk' 
            ? recipients 
            : [recipient || process.env.ADMIN_PHONE_NUMBER];

        if (!numbersToSend || numbersToSend.length === 0 || !numbersToSend[0]) {
             return NextResponse.json({ success: false, error: 'Recipient not specified.' }, { status: 400 });
        }

        const activeApi = await getActiveSmsApi();
        
        let result;
        if (activeApi === 'bulksmsbd') {
            console.log(`Using BulkSMSBD for ${numbersToSend.length} numbers.`);
            result = await sendBulkSmsBd(numbersToSend, message);
        } else {
            console.log(`Using ANBU SMS for ${numbersToSend.length} numbers.`);
            result = await sendAnbuSms(numbersToSend, message);
        }
        
        if (result.success) {
            return NextResponse.json({ success: true, message: "SMS process initiated." });
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
