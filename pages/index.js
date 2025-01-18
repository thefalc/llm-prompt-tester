import { useState } from 'react';
import Layout from '../components/Layout';
import ChatApp from '../components/ChatApp';
import AuthScreen from '../components/AuthScreen';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Layout title="Nimbus Prompter 2000">
      {isAuthenticated ? (
        <ChatApp />
      ) : (
        <AuthScreen onAuthenticate={() => setIsAuthenticated(true)} />
      )}
    </Layout>
  );
}
