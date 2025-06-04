require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GHL_AGENCY_API_KEY;
const OUTPUT_FILE = path.join(__dirname, 'all_contacts.json');

const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

async function getAllLocations() {
  const res = await axios.get('https://rest.gohighlevel.com/v1/locations/', { headers });
  return res.data.locations;
}

async function getContactsForLocation(locationId) {
  const res = await axios.get(`https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}`, {
    headers,
  });
  return res.data.contacts || [];
}

(async () => {
  try {
    console.log('📍 Fetching locations...');
    const locations = await getAllLocations();
    console.log(`✅ Found ${locations.length} locations.`);

    const allData = [];

    for (const location of locations) {
      console.log(`🔄 Fetching contacts for: ${location.name}`);
      try {
        const contacts = await getContactsForLocation(location.id);
        allData.push({
          location: location.name,
          locationId: location.id,
          contacts,
        });
      } catch (err) {
        console.error(`❌ Error fetching contacts for ${location.name}:`, err.response?.data || err.message);
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
    console.log(`✅ All contacts saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Failed to fetch data:', error.response?.data || error.message);
  }
})();
