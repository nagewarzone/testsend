const express = require('express');
const fetch = require('node-fetch'); // หรือ axios
const app = express();
app.use(express.json());

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1375138473677426830/A1S9Xos1tozwo-TPTBIv7mO36MFNt_Ol1Vt_dlXjAsLJL16wIu6MZY3E8Yn1niJrktMK';

app.post('/upgrade', async (req, res) => {
  const { username, itemName, result } = req.body;

  // result = 'success', 'fail', 'broken'

  // กรองเฉพาะกรณีที่ต้องแจ้งเตือน
  if (['success', 'fail', 'broken'].includes(result)) {
    let message = '';

    if (result === 'success') {
      message = `✅ ผู้เล่น ${username} อัพเกรดไอเท็ม ${itemName} สำเร็จ! 🎉`;
    } else if (result === 'fail') {
      message = `❌ ผู้เล่น ${username} อัพเกรดไอเท็ม ${itemName} ล้มเหลว! 😞`;
    } else if (result === 'broken') {
      message = `💥 ผู้เล่น ${username} ไอเท็ม ${itemName} แตกหายไปเลย! 😱`;
    }

    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      return res.json({ status: 'ok', message: 'แจ้งเตือนไปที่ Discord แล้ว' });
    } catch (error) {
      console.error('ส่ง webhook ไม่สำเร็จ:', error);
      return res.status(500).json({ status: 'error', message: 'ส่งแจ้งเตือนไป Discord ไม่สำเร็จ' });
    }
  } else {
    // ไม่ต้องแจ้งเตือนถ้า result ไม่ใช่ case ที่กำหนด
    return res.json({ status: 'ok', message: 'ไม่ต้องแจ้งเตือน' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
