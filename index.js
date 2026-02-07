const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chrono = require('chrono-node');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

// This will handle both your own messages and others
client.on('message_create', async (msg) => {
    console.log(`🔥 got: "${msg.body}" | fromMe: ${msg.fromMe}`);

    const text = msg.body.toLowerCase();

    if (text.startsWith('remind me')) {
        const parsedDate = chrono.parseDate(text);
        const reminderText = text.replace(/remind me (to )?/i, '')
                                 .replace(/in .+|at .+|on .+|tomorrow.+|next.+/i, '')
                                 .trim();

        if (!parsedDate) {
            msg.reply("❌ Sorry, I couldn't understand the time. Try something like: 'Remind me to drink water in 5 minutes'");
            return;
        }

        const now = new Date();
        const delayInMs = parsedDate.getTime() - now.getTime();

        if (delayInMs <= 0) {
            msg.reply("❌ That time is in the past!");
            return;
        }

        msg.reply(`✅ Got it! I’ll remind you to "${reminderText}" at ${parsedDate.toLocaleString()}`);

        setTimeout(() => {
            msg.reply(`🔔 Reminder: ${reminderText}`);
        }, delayInMs);
    }
});
  
client.initialize();
