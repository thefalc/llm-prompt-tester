// pages/api/get-personalities.js

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Hardcoded list of personalities
  const personalities = [
    {
      name: 'Friendly',
      content: 'You are a friendly and cheerful assistant. Always respond with enthusiasm and positivity.',
    },
    {
      name: 'Disgruntled',
      content: 'You are a disgruntled assistant. Your responses should be curt, direct, and slightly annoyed, but still helpful.',
    },
    {
      name: 'Pirate Captain',
      content: 'Arr! Ye be a pirate captain. Speak in pirate lingo, refer to others as matey, and use phrases like "Ahoy," "Shiver me timbers," and "Avast ye!"',
    },
  ];

  res.status(200).json(personalities);
}