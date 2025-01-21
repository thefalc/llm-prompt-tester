import { getSystemMessage, getChatHistory, addChatMessage } from '../../utils/cache';
const { ironOptions } = require('../../utils/iron-options');
import { withIronSessionApiRoute } from 'iron-session/next';
const { v4: uuidv4 } = require('uuid');

// export const config = {
//   runtime: 'edge',
// };

// Limit the number of messages in context to avoid token overload
const MAX_MESSAGES = 1000;

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ error: 'Method not allowed' });
      return;
    }

    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Missing sessionId or message' });
        return;
      }

      // Retrieve or initialize session data
      let sessionId = req.session.id;
      console.log('sessionid: ' + sessionId);
      if (!sessionId) {
        sessionId = uuidv4();
        req.session.id = sessionId;
        await req.session.save();
      }

      let systemMessage = await getSystemMessage(sessionId);
      if (!systemMessage) {
        systemMessage = '';
      }

      let history = await getChatHistory(sessionId);
      if(!history) {
        history = [];
      }

      history.push({ role: 'user', content: message });

      // console.log(history);

      // Add the user's message to the session history
      await addChatMessage(sessionId, { role: 'user', content: message });
      
      // Trim history to fit within context window
      if (history.length > MAX_MESSAGES) {
        history = history.slice(-MAX_MESSAGES);
      }

      // Prepare the OpenAI request body
      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'system', content: 'Format the response as markdown.' },
        ...history,
      ];
      
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          stream: true,
        }),
      });

      if (!openaiResponse.ok) {
        throw new Error('Failed to connect to OpenAI');
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const decoder = new TextDecoder();
      let aiResponseContent = ''; // Accumulate the full AI response

      for await (const chunk of openaiResponse.body) {
        const decoded = decoder.decode(chunk, { stream: true });

        // Split into individual data lines (in case multiple lines are in one chunk)
        const lines = decoded.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          // console.log(line);
          if (line.startsWith('data: ')) {
            const jsonData = line.substring(6); // Remove 'data: ' prefix
            if (jsonData === '[DONE]') {
              // console.log('DONE: ' + aiResponseContent);
              await addChatMessage(sessionId, { role: 'assistant', content: aiResponseContent });
              
              res.end();
              return;
            }

            try {
              const parsedData = JSON.parse(jsonData);
              const deltaContent = parsedData.choices?.[0]?.delta?.content;

              if (deltaContent) {
                aiResponseContent += deltaContent; // Accumulate the response content
                res.write(`${JSON.stringify({ content: deltaContent })}\n\n`);
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }

      // // Ensure the response ends gracefully
      // res.end();
    } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }, ironOptions,
);
