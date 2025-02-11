// pages/api/get-prompts.js
const fs = require('fs');
const path = require('path');

const promptsDir = path.join(process.cwd(), "prompts"); 

function loadPrompts() {
  const promptFiles = fs.readdirSync(promptsDir);
  const prompts = promptFiles.map(file => {
    const filePath = path.join(promptsDir, file);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  });

  return prompts;
}

const prompts = await loadPrompts();

const sortedPrompts = prompts.sort((a, b) => {
  return a.name.localeCompare(b.name);
});

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(200).json(sortedPrompts);
}
