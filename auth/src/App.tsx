import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_CLERK_KEY';

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <RoleProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <AppRoutes />
            </main>
          </div>
        </RoleProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
