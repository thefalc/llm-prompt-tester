import { getChatHistory } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';
import { getOrInitializeSession } from '../../utils/session-utils';

// Wrap the handler with Iron Session
export default withIronSessionApiRoute(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const sessionId = await getOrInitializeSession(req);

  // Retrieve chat history from the session
  const chatHistory = await getChatHistory(sessionId);

  res.status(200).json({ chatHistory });
}, ironOptions);
