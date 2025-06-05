const ghlService = require('../services/ghlService');
const tokenStore = require('../utils/tokenStore');

exports.handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Missing authorization code' });
  }

  try {
    const tokens = await ghlService.exchangeToken(code);

    // Save initial tokens
    await tokenStore.saveTokens(tokens);

    // Handle agency (Company) type
    if (tokens.userType === 'Company') {
      const installedLocations = await ghlService.getInstalledLocations(tokens.companyId);

      if (!installedLocations || !installedLocations.length) {
        return res.status(400).json({ success: false, message: 'No installed subaccounts found' });
      }

      // For demo, just pick the first installed location
      const firstLocationId = installedLocations[0]._id;

      const locationToken = await ghlService.getLocationAccessToken(
        tokens.companyId,
        firstLocationId
      );

      await tokenStore.saveLocationToken(firstLocationId, locationToken);
    }

    res.redirect('/contacts'); // After successful auth
  } catch (error) {
    console.error('❌ OAuth callback error:', error.message || error);
    res.status(500).json({ success: false, message: 'OAuth flow failed.' });
  }
};
