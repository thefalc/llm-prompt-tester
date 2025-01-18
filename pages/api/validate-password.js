const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';
require('dotenv').config();

const PASSWORD = process.env.APP_PASSWORD;

export default withIronSessionApiRoute(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Compare password (ignoring case)
    if (password.toLowerCase() === PASSWORD.toLowerCase()) {
      // Save authentication to the session
      req.session.authenticated = true;
      await req.session.save();

      return res.status(200).json({ message: "Authenticated successfully" });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Error validating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}, ironOptions);