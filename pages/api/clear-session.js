import { clearSession } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(async function handler(req, res) {
  // Retrieve or initialize session data
  let sessionId = req.session.id;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    req.session.id = sessionId;
    await req.session.save();
  }

  await clearSession(sessionId);

  return res.status(200).json({ ok: true });
}, ironOptions);