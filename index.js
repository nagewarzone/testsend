const fetch = require('node-fetch');

const DISCORD_WEBHOOK_URL = 'ใส่เว็บฮุคที่ใช้งานจริงที่นี่';

async function sendDiscordMessage(content) {
  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      console.error('Failed to send Discord message:', res.statusText);
      const text = await res.text();
      console.error('Response body:', text);
    } else {
      console.log('Message sent successfully!');
    }
  } catch (err) {
    console.error('Error sending Discord message:', err);
  }
}

sendDiscordMessage('ทดสอบส่งข้อความจาก Render')
  .then(() => process.exit(0));
