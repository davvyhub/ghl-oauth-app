const ghlService = require('../services/ghlService');
const tokenStore = require('../utils/tokenStore');

/**
 * Step 1: Redirect to GHL OAuth screen
 */
exports.startOAuth = (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const scope = process.env.SCOPES;

  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  res.redirect(authUrl);
};

/**
 * Step 2: Handle redirect from GHL and exchange code for token
 */
exports.handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Missing authorization code' });
  }

  try {
    // Exchange code for access token
    const tokens = await ghlService.exchangeToken(code);

    // Save the base token (usually agency-level)
    await tokenStore.saveTokens(tokens);

    // If user is an Agency (Company), get subaccounts
    if (tokens.userType === 'Company') {
      const installedLocations = await ghlService.getInstalledLocations(tokens.companyId);

      if (!installedLocations || !installedLocations.length) {
        return res.status(400).json({ success: false, message: 'No installed subaccounts found' });
      }

      // For demo/test: pick the first installed subaccount
      const firstLocationId = installedLocations[0]._id;

      // Get a location-scoped access token
      const locationToken = await ghlService.getLocationAccessToken(
        tokens.companyId,
        firstLocationId
      );

      // Save location token separately
      await tokenStore.saveLocationToken(firstLocationId, locationToken);
    }

    // ✅ Success – redirect to contact page or dashboard
    res.redirect('/contacts');
  } catch (error) {
    console.error('❌ OAuth callback error:', error.message || error);
    res.status(500).json({ success: false, message: 'OAuth flow failed.' });
  }
};
