import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { RoleProvider } from './context/RoleContext';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) throw new Error("Missing Clerk Publishable Key");

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <RoleProvider>
          <AppRoutes />
        </RoleProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
