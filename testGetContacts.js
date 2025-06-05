const axios = require('axios');
const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));
const accessToken = tokens.access_token;

async function getLocation() {
  try {
    const res = await axios.get('https://services.leadconnectorhq.com/v1/locations/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const locationId = res.data.locations?.[0]?.id;
    console.log('✅ Location ID:', locationId);
    return locationId;
  } catch (err) {
    console.error('❌ Failed to fetch location:', err.response?.data || err.message);
    process.exit(1);
  }
}

async function getContacts(locationId) {
  try {
    const res = await axios.get(`https://services.leadconnectorhq.com/v1/locations/${locationId}/contacts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Contacts fetched:');
    console.log(res.data.contacts || res.data);
  } catch (err) {
    console.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
  }
}

(async () => {
  const locationId = await getLocation();
  if (locationId) await getContacts(locationId);
})();
