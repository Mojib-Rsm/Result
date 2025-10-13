
'use server';

export async function sendTelegramNotification(message: string): Promise<{ success: boolean; error?: string }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram Bot Token or Chat ID is not configured in .env file.");
        return { success: false, error: "Telegram bot is not configured." };
    }

    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
            cache: 'no-store'
        });

        const data = await response.json();

        if (data.ok) {
            return { success: true };
        } else {
            console.error("Telegram API Error:", data.description);
            return { success: false, error: data.description };
        }
    } catch (error: any) {
        console.error("Failed to send Telegram notification:", error);
        return { success: false, error: 'Failed to send Telegram notification due to a network error.' };
    }
}
