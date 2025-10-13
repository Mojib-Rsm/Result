

interface SmsApiResult {
    error: number; // 0 for success
    sent?: string;
    id?: string;
    note?: string;
    errormsg?: string;
    [key: string]: any;
}

interface SmsApiResponse {
    result: SmsApiResult;
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

    const recipients = phoneNumbers.join(',');
    const encodedMessage = encodeURIComponent(message);
    
    const apiUrl = `https://api.smsmobileapi.com/sendsms/?apikey=${apiKey}&recipients=${recipients}&message=${encodedMessage}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store'
        });
        
        const responseText = await response.text();
        console.log("SMS API Raw Response:", responseText);

        try {
            const data: SmsApiResponse = JSON.parse(responseText);

            if (data.result && data.result.error === 0) {
                return { success: true };
            } else {
                const errorMessage = data.result?.note || data.result?.errormsg || 'An unknown error occurred from SMS API.';
                console.error("SMS API Error:", errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (jsonError) {
             if (responseText.toLowerCase().includes('success')) {
                 return { success: true };
             }
             console.error("SMS API non-JSON or unexpected response:", responseText);
             return { success: false, error: `API থেকে একটি অপ্রত্যাশিত প্রতিক্রিয়া এসেছে: ${responseText}` };
        }

    } catch (error: any) {
        console.error("Failed to send SMS:", error);
        return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
    }
}
