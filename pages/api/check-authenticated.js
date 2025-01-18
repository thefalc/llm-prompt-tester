const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check if the authenticated session variable is set
    const isAuthenticated = req.session.authenticated || false;

    res.status(200).json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking authentication status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}, ironOptions);