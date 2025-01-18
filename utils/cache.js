import { MongoClient } from 'mongodb';
require('dotenv').config();

console.log('mongodb: ' + process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('nimbus_cache');
const sessionCollection = db.collection('sessions');

// Clear the session for the specific sessionId
export const clearSession = async (sessionId) => {
  if (!sessionId) {
    throw new Error('sessionId is required to clear a session');
  }

  await sessionCollection.deleteOne({ sessionId });
};

// Set the system message for the specific session
export const setSystemMessage = async (sessionId, message) => {
  await sessionCollection.updateOne(
    { sessionId },
    { $set: { systemMessage: message } },
    { upsert: true }
  );
};

// Get the system message for the specific session
export const getSystemMessage = async (sessionId) => {
  const session = await sessionCollection.findOne({ sessionId });
  return session?.systemMessage || '';
};

// Add a message to the chat history for the specific session
export const addChatMessage = async (sessionId, message) => {
  await sessionCollection.updateOne(
    { sessionId },
    { $push: { chatHistory: message } },
    { upsert: true }
  );
};

// Get chat history for the specific session
export const getChatHistory = async (sessionId) => {
  const session = await sessionCollection.findOne({ sessionId });
  return session?.chatHistory || [];
};

