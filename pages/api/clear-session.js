import { clearSession } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';
import { getOrInitializeSession } from '../../utils/session-utils';

export default withIronSessionApiRoute(async function handler(req, res) {
  // Retrieve or initialize session data
  const sessionId = await getOrInitializeSession(req);

  await clearSession(sessionId);

  return res.status(200).json({ ok: true });
}, ironOptions);