

import { NextResponse } from 'next/server';
import { getFirestore, collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { searchResultLegacy } from '@/lib/actions';
import { sendAnbuSms, sendBulkSmsBd } from '@/lib/sms';
import type { ExamResult } from '@/types';

export const dynamic = 'force-dynamic';

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


async function getSubscriptions() {
    const db = getFirestore(app);
    const subscriptionsRef = collection(db, 'subscriptions');
    const querySnapshot = await getDocs(subscriptionsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('cron_secret');

    if (process.env.NODE_ENV === 'production' && cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("Cron job started: Checking results for subscribers...");
        const subscriptions = await getSubscriptions();
        
        if (subscriptions.length === 0) {
            console.log("No subscriptions to process.");
            return NextResponse.json({ success: true, message: 'No subscriptions to process.' });
        }

        console.log(`Found ${subscriptions.length} subscriptions. Processing...`);

        const activeApi = await getActiveSmsApi();
        const sendSms = activeApi === 'bulksmsbd' ? sendBulkSmsBd : sendAnbuSms;

        // We process them sequentially with a delay to avoid rate limiting
        for (const sub of subscriptions) {
            let message = '';
            let resultFound = false;

            try {
                // Fetch captcha first
                const captchaRes = await fetch('https://www.bdedu.me/api/captcha');
                if (!captchaRes.ok) throw new Error('Failed to fetch captcha for cron job');
                const captchaData = await captchaRes.json();
                
                const result = await searchResultLegacy({
                    exam: sub.exam,
                    year: sub.year,
                    board: sub.board,
                    roll: sub.roll,
                    reg: sub.reg,
                    captcha: captchaData.img, // This is incorrect, captcha needs solving
                    cookie: captchaData.cookie 
                });
                
                if ('error' in result) {
                    console.log(`Result for Roll ${sub.roll}: NOT PUBLISHED or error. Message: ${result.error}`);
                } else {
                    const examResult = result as ExamResult;
                    resultFound = true;
                     if (examResult.status === 'Pass') {
                        message = `অভিনন্দন! আপনার ${examResult.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আপনার GPA: ${examResult.gpa.toFixed(2)}. - bdedu.me`;
                    } else {
                        message = `আপনার ${sub.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। স্ট্যাটাস: Fail. - bdedu.me`;
                    }
                    console.log(`Result for Roll ${sub.roll}: SUCCESS. SMS: "${message}"`);
                }

            } catch (error: any) {
                 // This error means the result is likely not published or the info is wrong.
                console.log(`Result for Roll ${sub.roll}: FAILED during check. Error: ${error.message}.`);
            }
            
            // Send SMS if a result was found and processed
            if (resultFound && sub.phone && message) {
                 await sendSms([sub.phone], message);
                 // Delete subscription after sending notification
                 const db = getFirestore(app);
                 await deleteDoc(doc(db, "subscriptions", sub.id));
                 console.log(`Subscription for roll ${sub.roll} deleted after notification.`);
            }

            // Wait for 2 seconds before processing the next one to avoid overwhelming the result server
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return NextResponse.json({ success: true, message: `Processed ${subscriptions.length} subscriptions.` });

    } catch (error: any) {
        console.error("Cron job failed:", error);
        return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

    
