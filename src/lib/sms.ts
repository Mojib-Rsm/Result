
'use server';

interface SmsApiResponse {
    status_code?: number;
    status_text?: string;
    // other potential fields from the API response
    [key: string]: any;
}

const smsStatusMessages: { [key: number]: string } = {
    1001: 'Invalid Number',
    1002: 'Sender ID not correct/disabled',
    1003: 'Required fields are missing',
    1005: 'Internal Error',
    1006: 'Balance Validity Not Available',
    1007: 'Insufficient Balance',
    1011: 'User Id not found',
    1012: 'Masking SMS must be in Bengali',
    1013: 'Gateway not found for API key',
    1014: 'Sender Type Name not found',
    1015: 'No Valid Gateway for Sender ID',
    1016: 'Active Price Info not found',
    1017: 'Price Info not found',
    1018: 'Account is disabled',
    1019: 'Price for this sender type is disabled',
    1020: 'Parent account not found',
    1021: 'Parent active price not found',
    1031: 'Account Not Verified',
    1032: 'IP Not Whitelisted',
};

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

        if (responseText.includes("202 SMS Submitted Successfully")) {
            return { success: true };
        }

        try {
            const responseData: SmsApiResponse = JSON.parse(responseText);

            const statusCode = responseData.status_code ? parseInt(responseData.status_code.toString(), 10) : 0;

            if (statusCode === 202) {
                 return { success: true };
            } else {
                 const errorMessage = smsStatusMessages[statusCode] || responseData.status_text || `An unknown error occurred (Code: ${statusCode})`;
                 console.error("SMS API Error:", errorMessage);
                 return { success: false, error: errorMessage };
            }
        } catch (jsonError) {
             console.error("SMS API non-JSON response:", responseText);
             return { success: false, error: `API থেকে একটি অপ্রত্যাশিত প্রতিক্রিয়া এসেছে: ${responseText}` };
        }

    } catch (error: any) {
        console.error("Failed to send SMS:", error);
        return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
    }
}
