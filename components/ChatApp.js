import { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatApp = () => {
  const [systemMessage, setSystemMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [personality, setPersonality] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [personalities, setPersonalities] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const typingBufferRef = useRef('');
  const lastMessageRef = useRef(null);
  const controllerRef = useRef(null);
  const stopTypingRef = useRef(false);

  // Fetch personalities and prompts on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const personalityResponse = await fetch('/api/get-personalities');
        if (!personalityResponse.ok) {
          throw new Error('Failed to fetch personalities');
        }
        const personalityData = await personalityResponse.json();
        setPersonalities(personalityData);

        const promptResponse = await fetch('/api/get-prompts');
        if (!promptResponse.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const promptData = await promptResponse.json();
        setPrompts(promptData);

        const sessionResponse = await fetch('/api/get-session');

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          let chatHistory = sessionData.chatHistory;
          if (Array.isArray(chatHistory)) {
            const systemMessageEntry = chatHistory.find(entry => entry.role === 'system');
            if (systemMessageEntry) {
              setSystemMessage(systemMessageEntry.content);
            }
            const userAndAiMessages = chatHistory.filter(entry => entry.role !== 'system');
            setChatHistory(userAndAiMessages.map(entry => ({
              sender: entry.role === 'user' ? 'user' : 'ai',
              text: entry.content,
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const saveSystemMessage = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-system-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ systemMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to save system message');
      }

      setIsSaving('Saved');
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Error saving system message:', error);
      setIsSaving(false);
    }
  };

  const clearChat = async () => {
    try {
      const response = await fetch('/api/clear-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear session');
      }

      setChatHistory([]);
      setSystemMessage('');
    } catch (error) {
      console.error('Error clearing chat session:', error);
    }
  };

  const stopProcessing = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      stopTypingRef.current = true;
      setIsProcessing(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput || isProcessing) return;

    setIsProcessing(true);
    stopTypingRef.current = false;

    const newMessage = { sender: 'user', text: userInput };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setUserInput('');

    controllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
        }),
        signal: controllerRef.current.signal,
      });

      if (!response.body) {
        throw new Error('Server did not return a readable stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      const aiMessage = { sender: 'ai', text: '' };
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, aiMessage];
        lastMessageRef.current = updatedHistory[updatedHistory.length - 1];
        return updatedHistory;
      });

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        buffer += decoder.decode(value, { stream: true });

        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, boundaryIndex).trim();
          buffer = buffer.slice(boundaryIndex + 1);

          if (line) {
            try {
              const jsonData = JSON.parse(line);
              const content = jsonData.content;

              if (content) {
                typingBufferRef.current += content;
                for (let i = 0; i < content.length; i++) {
                  if (stopTypingRef.current) break;

                  await new Promise((resolve) => setTimeout(resolve, 20));

                  if (lastMessageRef.current) {
                    lastMessageRef.current.text += content[i];
                    setChatHistory((prevHistory) => [...prevHistory]);
                  }
                }
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error);
      }
    } finally {
      typingBufferRef.current = '';
      setIsProcessing(false);
      controllerRef.current = null;
      stopTypingRef.current = false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      sendMessage();
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Options Section */}
      <div className="options-container p-3 border-end d-flex flex-column" style={{ width: '250px' }}>
        <div className="mb-3">
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            className="form-control"
            rows="3"
            placeholder="Enter the system message here..."
          />
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={saveSystemMessage}
            disabled={isSaving}
          >
            {isSaving === true ? 'Saving...' : isSaving === 'Saved' ? 'Saved' : 'Save System Message'}
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label">Personality</label>
          <select
            value={personality}
            onChange={(e) => {
              setPersonality(e.target.value);
              const selectedPersonality = personalities.find((p) => p.name === e.target.value);
              if (selectedPersonality) {
                setSystemMessage(selectedPersonality.content);
              }
            }}
            className="form-select"
          >
            <option value="">Select Personality</option>
            {personalities.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Prompt Template</label>
          <select
            value={promptTemplate}
            onChange={(e) => {
              setPromptTemplate(e.target.value);
              const selectedPrompt = prompts.find((p) => p.name === e.target.value);
              if (selectedPrompt) {
                setUserInput(selectedPrompt.content);
              }
            }}
            className="form-select"
          >
            <option value="">Select Template</option>
            {prompts.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-secondary w-100 mt-auto" onClick={clearChat}>Clear Chat</button>
      </div>

      {/* Chat Section */}
      <div className="flex-grow-1 d-flex flex-column align-items-center">
        <h2 className="text-center py-2 d-flex align-items-center justify-content-center" style={{ fontSize: '2rem', maxWidth: '800px', width: '100%' }}>
          Nimbus Prompter 2000
          <img src="nimbus-2000.webp" alt="Broomstick" className="ms-2" style={{ height: '2rem' }} />
        </h2>

        <div className="flex-grow-1 chat-history p-3" style={{ overflowY: 'auto', whiteSpace: 'pre-wrap', backgroundColor: '#ffffff', maxWidth: '800px', width: '100%' }}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-3 chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {message.sender === 'ai' && <strong>AI:</strong>}
              <span>{message.text}</span>
            </div>
          ))}
        </div>

        <ChatInput
          userInput={userInput}
          setUserInput={setUserInput}
          sendMessage={sendMessage}
          stopProcessing={stopProcessing}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default ChatApp;
