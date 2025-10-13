
import { NextResponse } from 'next/server';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { searchResultLegacy } from '@/lib/actions';
import { sendBulkSms } from '@/lib/sms';
import type { HistoryItem } from '@/types';

export const dynamic = 'force-dynamic';

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

        // We process them sequentially with a delay to avoid rate limiting
        for (const sub of subscriptions) {
            let message = '';
            try {
                // Assuming result is not published yet, so we don't need captcha for this logic.
                // The legacy search action might fail if captcha is enforced server-side even for old results.
                // This is a placeholder for the logic that will run on result day.
                // On result day, the captcha logic might need to be adapted or bypassed for this automated check.
                const result = await searchResultLegacy({
                    exam: sub.exam,
                    year: sub.year,
                    board: sub.board,
                    roll: sub.roll,
                    reg: sub.reg,
                    captcha: '12345', // Placeholder captcha, might need a real solution.
                    cookie: '' // Placeholder cookie
                });

                if (result.status === 'Pass') {
                    message = `অভিনন্দন! আপনার ${result.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আপনার GPA: ${result.gpa.toFixed(2)}. বিস্তারিত দেখুন: www.bdedu.me`;
                } else {
                    message = `আপনার ${sub.exam.toUpperCase()} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। স্ট্যাটাস: Fail. বিস্তারিত দেখুন: www.bdedu.me`;
                }
                 console.log(`Result for Roll ${sub.roll}: SUCCESS. SMS: "${message}"`);

            } catch (error: any) {
                 // This error means the result is likely not published or the info is wrong.
                message = `দুঃখিত, আপনার ${sub.exam.toUpperCase()} পরীক্ষার জন্য দেওয়া রোল (${sub.roll}) ও বোর্ডের তথ্যে কোনো ফলাফল পাওয়া যায়নি। তথ্য সঠিক কিনা যাচাই করুন। -bdedu.me`;
                console.log(`Result for Roll ${sub.roll}: FAILED. Error: ${error.message}. SMS: "${message}"`);
            }
            
            // Send SMS
            if (sub.phone) {
                 await sendBulkSms([sub.phone], message);
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
