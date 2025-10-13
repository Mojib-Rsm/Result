
'use server';

interface SmsApiResponse {
    status_code: number;
    status_text: string;
    // Add other potential fields from the response if known
}

export async function sendBulkSms(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; error?: string }> {
    
    const apiKey = process.env.SMS_API_KEY;
    const senderId = process.env.SMS_SENDER_ID;

    if (!apiKey || !senderId) {
        console.error("SMS API Key or Sender ID is not configured in .env file.");
        return { success: false, error: "SMS সার্ভিসটি কনফিগার করা হয়নি।" };
    }

    const numbers = phoneNumbers.join(',');
    const encodedMessage = encodeURIComponent(message);

    const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${numbers}&senderid=${senderId}&message=${encodedMessage}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', // or 'POST' if the API supports it
        });
        
        const responseData: SmsApiResponse = await response.json();
        
        // According to many bulk SMS providers, a 200-level status code might mean success
        if (responseData.status_code >= 200 && responseData.status_code < 300) {
            console.log("SMS API Response:", responseData);
            return { success: true };
        } else {
            console.error("SMS API Error:", responseData);
            return { success: false, error: responseData.status_text || 'SMS API থেকে একটি ত্রুটি এসেছে।' };
        }

    } catch (error: any) {
        console.error("Failed to send SMS:", error);
        return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
    }
}
