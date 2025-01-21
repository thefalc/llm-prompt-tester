// utils/sessionUtils.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Retrieve or initialize session data.
 * @param {Object} req - The HTTP request object.
 * @returns {Promise<string>} - The session ID.
 */
export const getOrInitializeSession = async (req) => {
  let sessionId = req.session.id;
  if (!sessionId) {
    sessionId = uuidv4();
    req.session.id = sessionId;
    await req.session.save();
  }
  return sessionId;
};