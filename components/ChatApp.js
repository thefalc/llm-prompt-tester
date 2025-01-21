import { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatOptions from './ChatOptions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
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
  const [showLoadingIcon, setShowLoadingIcon] = useState(false);
  const [hasScrolledToAI, setHasScrolledToAI] = useState(false);

  const typingBufferRef = useRef('');
  const lastMessageRef = useRef(null);
  const stopTypingRef = useRef(false);
  const controllerRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const chatInputRef = useRef(null);
  const aiStartRef = useRef(null);

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

  // Scroll to the bottom when the user sends a message
  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.sender === 'user' && chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight + '100';
      }
    }
  }, [chatHistory]);

  useEffect(() => {
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage?.sender === 'ai' && !hasScrolledToAI) {
      if (aiStartRef.current) {
        aiStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHasScrolledToAI(true); // Set the flag to true after scrolling
      }
    }
  }, [chatHistory, hasScrolledToAI]);

  // Reset scroll flag when a new user message is sent
  useEffect(() => {
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage?.sender === 'user') {
      setHasScrolledToAI(false); // Reset flag for the next AI response
    }
  }, [chatHistory]);

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
      setPromptTemplate('');
      setPersonality('');
    } catch (error) {
      console.error('Error clearing chat session:', error);
    }
  };

  const stopProcessing = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      stopTypingRef.current = true;
      setIsProcessing(false);
      setShowLoadingIcon(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput || isProcessing) return;
  
    setIsProcessing(true);
    setShowLoadingIcon(true); // Show the loading icon
    stopTypingRef.current = false;
  
    const newMessage = { sender: 'user', text: userInput };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setUserInput('');

    if (chatInputRef.current) {
      chatInputRef.current.adjustHeight();
    }
  
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
                console.log(content)
                // Stop showing the loading icon once content starts streaming
                setShowLoadingIcon(false);

                typingBufferRef.current += content;
                for (let i = 0; i < content.length; i++) {
                  if (stopTypingRef.current) break;
  
                  await new Promise((resolve) => setTimeout(resolve, 5));
  
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
      setShowLoadingIcon(false);
    }
  };
  
  const handlePromptSelect = (value) => {
    const selected = prompts.find((p) => p.name === value);
    if (selected) {
      setPromptTemplate(value);
      setUserInput(selected.content);
      if (chatInputRef.current) {
        chatInputRef.current.adjustHeight();
      }
    }
  };

  // Dynamic layout styles based on chat history presence
  const layoutStyle = chatHistory.length === 0 ? 'd-flex flex-column justify-content-center align-items-center vh-100' : 'd-flex flex-column align-items-center';

  return (
    <div className="d-flex vh-100">
      <ChatOptions
        systemMessage={systemMessage}
        setSystemMessage={setSystemMessage}
        saveSystemMessage={saveSystemMessage}
        isSaving={isSaving}
        personality={personality}
        setPersonality={setPersonality}
        personalities={personalities}
        promptTemplate={promptTemplate}
        setPromptTemplate={setPromptTemplate}
        prompts={prompts}
        handlePromptSelect={handlePromptSelect}
        clearChat={clearChat}
      />
      <div className={`flex-grow-1 ${layoutStyle}`}>
      <h2
        className="text-center py-2 title"
      >
        Nimbus Prompter 2000
        <img src="nimbus-2000.webp" alt="Broomstick" className="ms-2" style={{ height: '2rem' }} />
      </h2>

        {chatHistory.length > 0 && (
          <div className="flex-grow-1 chat-history p-3" ref={chatHistoryRef} style={{ overflowY: 'auto', whiteSpace: 'pre-wrap', backgroundColor: '#ffffff', maxWidth: '800px', width: '100%' }}>
            {chatHistory.map((message, index) => {
            const isLastAIMessage = message.sender === 'ai' && index === chatHistory.length - 1;
            return (
              <div key={index} ref={isLastAIMessage ? aiStartRef : null} className={`mb-3 ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                {message.sender === 'ai' ? (
                  <>
                    <strong>AI:</strong>
                    {isLastAIMessage && showLoadingIcon && (
                      <span className="ms-2 spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                    )}
                    <ReactMarkdown
                      children={message.text}
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      rehypePlugins={[rehypeSanitize]}
                    />
                  </>
                ) : (
                  <>
                    <span className="ms-2">{message.text}</span>
                  </>
                )}
              </div>
            );
          })}
          </div>
        )}

        <ChatInput
          ref={chatInputRef}
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
