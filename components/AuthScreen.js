import { useState, useEffect } from 'react';

const AuthScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Check if the user is already authenticated on load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/check-authenticated');
        if (response.ok) {
          const { isAuthenticated } = await response.json();
          if (isAuthenticated) {
            onAuthenticate(); // Automatically authenticate the user
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthentication();
  }, [onAuthenticate]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/validate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onAuthenticate();
        setLoginError('');
      } else {
        setLoginError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Error validating password:', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      handleLogin();
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="p-4 border rounded bg-white shadow" style={{ width: '650px' }}>
        <h2 className="text-center mb-4">Welcome to Nimbus Prompter 2000</h2>
        <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onKeyPress={handleKeyPress}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <div className="text-danger mb-3 text-center">{loginError}</div>}
          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Alohomora
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;