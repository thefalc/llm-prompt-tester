import { getChatHistory } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';

// Wrap the handler with Iron Session
export default withIronSessionApiRoute(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Retrieve or initialize session data
  let sessionId = req.session.id;
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // Generate a new session ID
    req.session.id = sessionId;
    await req.session.save();
  }

  // Retrieve chat history from the session
  const chatHistory = await getChatHistory(sessionId);

  console.log(chatHistory);

  res.status(200).json({ chatHistory });
}, ironOptions);
