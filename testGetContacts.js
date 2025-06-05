const axios = require('axios');
const fs = require('fs');

// Load token from file
const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));
const accessToken = tokens.access_token;

async function getContacts() {
  try {
    const response = await axios.get('https://rest.gohighlevel.com/v1/contacts/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Contacts fetched successfully:\n');
    console.log(response.data.contacts || response.data);

  } catch (err) {
    console.error('❌ Failed to fetch contacts:');
    console.error(err.response?.data || err.message);
  }
}

getContacts();
