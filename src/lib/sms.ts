
'use server';

interface SmsApiResponse {
    status_code: number;
    status_text: string;
    // Add other potential fields from the response if known
}

const smsStatusMessages: { [key: number]: string } = {
    202: 'SMS Submitted Successfully',
    1001: 'Invalid Number. নম্বরটি ভুল।',
    1002: 'Sender ID is not correct or disabled. প্রেরকের আইডি সঠিক নয় বা নিষ্ক্রিয় আছে।',
    1003: 'Required fields are missing. প্রয়োজনীয় তথ্য অনুপস্থিত।',
    1005: 'Internal Error. অভ্যন্তরীণ সার্ভার সমস্যা।',
    1006: 'Balance Validity Not Available. অ্যাকাউন্টের মেয়াদ শেষ।',
    1007: 'Balance Insufficient. অপর্যাপ্ত ব্যালেন্স।',
    1011: 'User Id not found. ব্যবহারকারী আইডি পাওয়া যায়নি।',
    1012: 'Masking SMS must be sent in Bengali. মাস্কিং SMS বাংলায় পাঠাতে হবে।',
    1013: 'Sender ID has not found Gateway. গেটওয়ে পাওয়া যায়নি।',
    1014: 'Sender Type Name not found. প্রেরকের ধরন পাওয়া যায়নি।',
    1015: 'Sender ID has not found Any Valid Gateway. কোনো বৈধ গেটওয়ে পাওয়া যায়নি।',
    1016: 'Sender Type Name Active Price Info not found. মূল্যের তথ্য পাওয়া যায়নি।',
    1017: 'Sender Type Name Price Info not found. মূল্যের তথ্য পাওয়া যায়নি।',
    1018: 'The Owner of this Account is disabled. অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।',
    1019: 'The Price of this Account is disabled. এই অ্যাকাউন্টের জন্য মূল্য নির্ধারণ করা নেই।',
    1020: 'The parent of this account is not found. মূল অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।',
    1021: 'The parent active price of this account is not found. মূল অ্যাকাউন্টের মূল্য পাওয়া যায়নি।',
    1031: 'Your Account Not Verified. আপনার অ্যাকাউন্ট যাচাই করা হয়নি।',
    1032: 'IP Not whitelisted. আপনার আইপি ঠিকানাটি অনুমোদিত নয়।',
};


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
        
        if (responseData.status_code === 202) {
            console.log("SMS API Response:", responseData);
            return { success: true };
        } else {
            const errorMessage = smsStatusMessages[responseData.status_code] || responseData.status_text || 'SMS API থেকে একটি অজানা ত্রুটি এসেছে।';
            console.error("SMS API Error:", responseData);
            return { success: false, error: errorMessage };
        }

    } catch (error: any) {
        console.error("Failed to send SMS:", error);
        return { success: false, error: 'SMS পাঠানোর সময় একটি নেটওয়ার্ক সমস্যা হয়েছে।' };
    }
}

