

interface SmsApiResponse {
    status?: string;
    message?: string;
    error?: string;
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
        console.error("ANBU SMS API Key is not configured.");
        return { success: false, error: "ANBU SMS সার্ভিসটি কনফিগার করা হয়নি।" };
    }

    let allSuccessful = true;
    let firstError: string | undefined = undefined;

    for (const number of phoneNumbers) {
        try {
            const response = await fetch('https://sms.anbuinfosec.live/api/v1/sms/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: apiKey,
                    recipient: number,
                    message: message,
                    senderId: 'ANBUSMS'
                }),
                cache: 'no-store'
            });

            const data: SmsApiResponse = await response.json();
            
            if (response.ok && data.status === 'success') {
                console.log(`ANBU SMS sent successfully to ${number}`);
            } else {
                allSuccessful = false;
                const errorMessage = data.message || data.error || 'An unknown error occurred from ANBU SMS API.';
                console.error(`ANBU SMS API Error for ${number}:`, errorMessage);
                if (!firstError) firstError = errorMessage;
            }

        } catch (error: any) {
            allSuccessful = false;
            const networkError = 'ANBU SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।';
            console.error(`Failed to send ANBU SMS to ${number}:`, error);
            if (!firstError) firstError = networkError;
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
    const senderId = process.env.SMS_SENDER_ID_BULKSMSBD;

    if (!apiKey || !senderId) {
        console.error("BulkSMSBD API Key or Sender ID is not configured.");
        return { success: false, error: "BulkSMSBD সার্ভিসটি কনফিগার করা হয়নি।" };
    }

    let allSuccessful = true;
    let firstError: string | undefined = undefined;
    
    const encodedMessage = encodeURIComponent(message);

    for (const number of phoneNumbers) {
        const url = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${number}&senderid=${senderId}&message=${encodedMessage}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });

            const data = await response.json();
            
            if (response.ok && data.response_code === 202) {
                 console.log(`BulkSMSBD sent successfully to ${number}`);
            } else {
                allSuccessful = false;
                const errorMessage = data.error_message || 'An unknown error occurred from BulkSMSBD API.';
                console.error(`BulkSMSBD API Error for ${number}:`, errorMessage);
                if (!firstError) firstError = errorMessage;
            }

        } catch (error: any) {
            allSuccessful = false;
            const networkError = 'BulkSMSBD পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।';
            console.error(`Failed to send BulkSMSBD to ${number}:`, error);
            if (!firstError) firstError = networkError;
        }
    }
    
     if (allSuccessful) {
        return { success: true };
    } else {
        return { success: false, error: firstError || "এক বা একাধিক BulkSMSBD পাঠাতে সমস্যা হয়েছে।" };
    }
}
