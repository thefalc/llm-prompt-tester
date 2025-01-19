import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const ChatInput = forwardRef(({ userInput, setUserInput, sendMessage, isProcessing }, ref) => {
  const textareaRef = useRef(null);

  // Function to adjust the textarea height dynamically
  const adjustHeight = () => {
    if (textareaRef.current) {
      console.log('adjustHeight');
      console.log(textareaRef.current.value);
      textareaRef.current.style.height = 'auto';

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
        }
      }, 10);
    }
  };

  // Expose the adjustHeight method to the parent component
  useImperativeHandle(ref, () => ({
    adjustHeight,
  }));

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent creating a newline
      if (!isProcessing && userInput.trim()) {
        sendMessage(); // Send the message
      }
    }
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
    adjustHeight();
  };

  return (
    <div
      className="p-3"
      style={{
        maxWidth: '800px',
        width: '100%',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        marginBottom: '10px',
        background: '#e3e3e3',
      }}
    >
      <textarea
        ref={textareaRef}
        value={userInput}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="form-control mb-2 textarea-no-border"
        rows="1"
        placeholder="Type your message here..."
        disabled={isProcessing}
      />
      <button
        className="btn btn-success w-100"
        onClick={() => {
          if (!isProcessing && userInput.trim()) {
            sendMessage();
          }
        }}
        disabled={isProcessing || !userInput.trim()}
      >
        Send
      </button>
    </div>
  );
});

export default ChatInput;