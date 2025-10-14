
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

    // The new API seems to send to one recipient at a time.
    // We will loop through the numbers and send one by one.
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
                }),
                cache: 'no-store'
            });

            const data: SmsApiResponse = await response.json();
            
            if (response.ok && data.status === 'success') {
                console.log(`SMS sent successfully to ${number}`);
                // Continue to the next number
            } else {
                const errorMessage = data.message || data.error || 'An unknown error occurred from SMS API.';
                console.error(`SMS API Error for ${number}:`, errorMessage);
                // We can decide if we want to stop on first error or continue.
                // For now, let's return on the first error.
                return { success: false, error: errorMessage };
            }

        } catch (error: any) {
            console.error(`Failed to send SMS to ${number}:`, error);
            return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
        }
    }

    // If the loop completes without returning an error, it means all were successful.
    return { success: true };
}
