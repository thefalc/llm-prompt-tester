// pages/api/get-prompts.js
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Hardcoded list of prompts
  const prompts = [
    {
      name: 'Cold Email',
      content: 'Write a concise, professional cold email introducing our product and how it can solve a key problem for the recipient. Keep it under 150 words.',
    },
    {
      name: 'LinkedIn Post about Data Streaming',
      content: 'Compose a LinkedIn post discussing the importance of real-time data streaming in modern applications. Highlight key benefits and use cases.',
    },
    {
      name: 'Event-Driven Blog Post Titles',
      content: 'Generate three compelling blog post titles about event-driven architectures and their impact on scalable, real-time systems.',
    },
  ];

  res.status(200).json(prompts);
}
