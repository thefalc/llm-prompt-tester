import { setSystemMessage } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';
const { v4: uuidv4 } = require('uuid');

// Wrap the handler with Iron Session
export default withIronSessionApiRoute(async function handler(req, res) {
  if (req.method === 'POST') {
    let { systemMessage } = req.body;

    if (!systemMessage || typeof systemMessage !== 'string') {
      systemMessage = '';
    }

    // Retrieve or initialize session data
    let sessionId = req.session.id;
    if (!sessionId) {
      sessionId = uuidv4();
      req.session.id = sessionId;
      await req.session.save();
    }

    await setSystemMessage(sessionId, systemMessage); // Save system message to the cache
    return res.status(200).json({ message: 'System message saved successfully' });
  }

  return res.setHeader('Allow', ['POST']).status(405).json({ error: `Method ${req.method} not allowed` });
}, ironOptions);