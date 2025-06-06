// services/contactService.js

const axios = require('axios');

const CONTACTS_BY_BUSINESS_URL =
  'https://services.leadconnectorhq.com/contacts/business';

module.exports = {
  /**
   * Fetch all contacts for a given location (businessId).
   * Automatically paginates until no more contacts remain.
   *
   * @param {Object} params
   * @param {string} params.locationToken  – the location-level access_token
   * @param {string} params.businessId     – the sub-account (location) ID
   * @param {number} [params.limit=100]    – max contacts per page (max allowed = 100)
   * @param {number} [params.skip=0]       – number of contacts to skip for pagination
   * @returns {Promise<Object[]>} array of contact objects
   */
  async fetchContactsByBusinessId({ locationToken, businessId, limit = 100, skip = 0 }) {
    let allContacts = [];
    let currentSkip = skip;

    while (true) {
      const response = await axios.get(
        `${CONTACTS_BY_BUSINESS_URL}/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${locationToken}`,
            Accept: 'application/json',
            Version: '2021-07-28',
          },
          params: {
            locationId: businessId,
            limit: limit,
            skip: currentSkip,
          },
        }
      );

      const contactsPage = response.data.contacts || [];
      allContacts.push(...contactsPage);

      // If fewer items than `limit` were returned, we've reached the end
      if (contactsPage.length < limit) {
        break;
      }

      // Otherwise, advance the skip counter and fetch the next page
      currentSkip += limit;
    }

    return allContacts;
  },
};
