

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface SmsApiResponse {
    status?: string;
    message?: string;
    error?: string;
    response_code?: number;
    error_message?: string;
}

const db = getFirestore(app);
const logsCollection = collection(db, 'sms-logs');

async function logSmsAttempt(
    apiProvider: 'anbu' | 'bulksmsbd',
    phoneNumber: string,
    message: string,
    status: 'success' | 'error',
    response: any
) {
    try {
        await addDoc(logsCollection, {
            timestamp: new Date(),
            apiProvider,
            phoneNumber,
            message,
            status,
            response: JSON.stringify(response, null, 2),
        });
    } catch (logError) {
        console.error(`Failed to write SMS log to Firestore for ${phoneNumber}:`, logError);
    }
}


/**
 * Sends SMS using the ANBU SMS API.
 */
export async function sendAnbuSms(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; error?: string }> {
    
    const apiKey = process.env.SMS_API_KEY_ANBU;

    if (!apiKey) {
        const errorMsg = "ANBU SMS সার্ভিসটি কনফিগার করা হয়নি।";
        console.error("ANBU SMS API Key is not configured.");
        await logSmsAttempt('anbu', phoneNumbers.join(','), message, 'error', { error: 'API Key not configured' });
        return { success: false, error: errorMsg };
    }

    let allSuccessful = true;
    let firstError: string | undefined = undefined;

    for (const number of phoneNumbers) {
        let status: 'success' | 'error' = 'error';
        let apiResponse: any = {};

        try {
            const response = await fetch('https://sms.anbuinfosec.live/api/v1/sms/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: apiKey,
                    recipient: number,
                    message: message,
                }),
                cache: 'no-store'
            });

            apiResponse = await response.json();
            
            if (response.ok && apiResponse.status === 'success') {
                console.log(`ANBU SMS sent successfully to ${number}`);
                status = 'success';
            } else {
                allSuccessful = false;
                const errorMessage = apiResponse.message || apiResponse.error || 'An unknown error occurred from ANBU SMS API.';
                console.error(`ANBU SMS API Error for ${number}:`, errorMessage);
                if (!firstError) firstError = errorMessage;
            }

        } catch (error: any) {
            allSuccessful = false;
            const networkError = 'ANBU SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।';
            console.error(`Failed to send ANBU SMS to ${number}:`, error);
            apiResponse = { error: error.message };
            if (!firstError) firstError = networkError;
        } finally {
            await logSmsAttempt('anbu', number, message, status, apiResponse);
        }
    }

    if (allSuccessful) {
        return { success: true };
    } else {
        return { success: false, error: firstError || "এক বা একাধিক ANBU SMS পাঠাতে সমস্যা হয়েছে।" };
    }
}


/**
 * Sends SMS using the BulkSMSBD API.
 */
export async function sendBulkSmsBd(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.SMS_API_KEY_BULKSMSBD;
    const senderId = '8809617614208'; // This is a constant value as per the API spec

    if (!apiKey) {
        const errorMsg = "BulkSMSBD সার্ভিসটি কনফিগার করা হয়নি।";
        console.error("BulkSMSBD API Key is not configured.");
        await logSmsAttempt('bulksmsbd', phoneNumbers.join(','), message, 'error', { error: 'API Key not configured' });
        return { success: false, error: errorMsg };
    }

    let allSuccessful = true;
    let firstError: string | undefined = undefined;
    
    const encodedMessage = encodeURIComponent(message);

    for (const number of phoneNumbers) {
        const url = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${number}&senderid=${senderId}&message=${encodedMessage}`;
        
        let status: 'success' | 'error' = 'error';
        let apiResponse: any = {};

        try {
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });

            apiResponse = await response.json();
            
            if (response.ok && apiResponse.response_code === 202) {
                 console.log(`BulkSMSBD sent successfully to ${number}`);
                 status = 'success';
            } else {
                allSuccessful = false;
                const errorMessage = apiResponse.error_message || 'An unknown error occurred from BulkSMSBD API.';
                console.error(`BulkSMSBD API Error for ${number}:`, errorMessage);
                if (!firstError) firstError = errorMessage;
            }

        } catch (error: any) {
            allSuccessful = false;
            const networkError = 'BulkSMSBD পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।';
            console.error(`Failed to send BulkSMSBD to ${number}:`, error);
            apiResponse = { error: error.message };
            if (!firstError) firstError = networkError;
        } finally {
            await logSmsAttempt('bulksmsbd', number, message, status, apiResponse);
        }
    }
    
     if (allSuccessful) {
        return { success: true };
    } else {
        return { success: false, error: firstError || "এক বা একাধিক BulkSMSBD পাঠাতে সমস্যা হয়েছে।" };
    }
}
