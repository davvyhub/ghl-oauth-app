const axios = require('axios');
const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));
const accessToken = tokens.access_token;

async function getLocationInfo() {
  try {
    const res = await axios.get('https://services.leadconnectorhq.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ User Info:');
    console.log(res.data);
  } catch (err) {
    console.error('❌ Failed to fetch user info:', err.response?.data || err.message);
  }
}

getLocationInfo();
