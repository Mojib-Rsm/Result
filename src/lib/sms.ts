
interface SmsApiResponse {
    status?: string;
    message?: string;
    error?: string;
}

export async function sendBulkSms(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; error?: string }> {
    
    const apiKey = process.env.SMS_API_KEY;

    if (!apiKey) {
        console.error("SMS API Key is not configured in .env file.");
        return { success: false, error: "SMS সার্ভিসটি কনফিগার করা হয়নি।" };
    }

    let allSuccessful = true;
    let firstError: string | undefined = undefined;

    for (const number of phoneNumbers) {
        try {
            const response = await fetch('https://sms.anbuinfosec.live/api/v1/sms/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                console.log(`SMS sent successfully to ${number}`);
            } else {
                allSuccessful = false;
                const errorMessage = data.message || data.error || 'An unknown error occurred from SMS API.';
                console.error(`SMS API Error for ${number}:`, errorMessage);
                if (!firstError) {
                    firstError = errorMessage;
                }
            }

        } catch (error: any) {
            allSuccessful = false;
            const networkError = 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।';
            console.error(`Failed to send SMS to ${number}:`, error);
            if (!firstError) {
                firstError = networkError;
            }
        }
    }

    if (allSuccessful) {
        return { success: true };
    } else {
        return { success: false, error: firstError || "এক বা একাধিক SMS পাঠাতে সমস্যা হয়েছে।" };
    }
}
