
'use server';

interface SmsApiResponse {
    // Define the expected success and error response structure from the new API
    // As the new API's response structure is unknown, we'll keep it generic for now.
    [key: string]: any;
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
        });
        
        // The success condition might need to be adjusted based on the new API's response format.
        if (response.ok) {
            const responseData: SmsApiResponse = await response.json().catch(() => ({}));
            console.log("SMS API Response:", responseData);
            // Assuming a successful response contains a specific status, e.g., status code 200 or a success field.
            // This logic may need refinement based on actual API responses.
            if (response.status === 200) { // Generic success check
                 return { success: true };
            } else {
                 const errorMessage = responseData.message || responseData.error || `API returned status: ${response.status}`;
                 console.error("SMS API Error:", responseData);
                 return { success: false, error: errorMessage };
            }
        } else {
            const errorText = await response.text();
            console.error("SMS API request failed with status:", response.status, errorText);
            return { success: false, error: `SMS API থেকে একটি ত্রুটিপূর্ণ প্রতিক্রিয়া এসেছে: ${response.statusText}` };
        }

    } catch (error: any) {
        console.error("Failed to send SMS:", error);
        return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
    }
}
