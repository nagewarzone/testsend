const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1375138473677426830/A1S9Xos1tozwo-TPTBIv7mO36MFNt_Ol1Vt_dlXjAsLJL16wIu6MZY3E8Yn1niJrktMK';

// middleware เพื่อรับ JSON body
app.use(express.json());

async function sendDiscord(content) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured.');
    return;
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      console.error('Failed to send Discord message:', res.statusText);
    }
  } catch (error) {
    console.error('Error sending Discord message:', error);
  }
}

// route ทดสอบส่งข้อความไป Discord
app.post('/send-discord', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message in request body' });

  await sendDiscord(message);
  res.json({ status: 'Message sent (or attempt made)' });
});

// เพิ่ม route สำหรับรับข้อมูลอัพเกรด
app.post('/upgrade', async (req, res) => {
  const { username, itemName, result } = req.body;

  if (!username || !itemName || !result) {
    return res.status(400).json({ error: 'Missing required fields: username, itemName, result' });
  }

  // result ต้องเป็น 'success', 'fail', หรือ 'broken' ถึงจะส่งแจ้งเตือน
  if (['success', 'fail', 'broken'].includes(result)) {
    let message = '';

    switch (result) {
      case 'success':
        message = `✅ ผู้เล่น **${username}** อัพเกรดไอเท็ม **${itemName}** สำเร็จ! 🎉`;
        break;
      case 'fail':
        message = `❌ ผู้เล่น **${username}** อัพเกรดไอเท็ม **${itemName}** ล้มเหลว! 😞`;
        break;
      case 'broken':
        message = `💥 ผู้เล่น **${username}** ไอเท็ม **${itemName}** แตกหายไปเลย! 😱`;
        break;
    }

    await sendDiscord(message);
    return res.json({ status: 'ok', message: 'แจ้งเตือนไปที่ Discord แล้ว' });
  } else {
    // กรณีอื่นไม่แจ้งเตือน
    return res.json({ status: 'ok', message: 'ไม่ต้องแจ้งเตือน' });
  }
});

app.get('/', (req, res) => {
  res.send('Discord webhook test service is running');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
