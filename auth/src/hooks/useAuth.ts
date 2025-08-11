import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export function useAuth() {
  const { getToken, isSignedIn, userId } = useClerkAuth();
  return { getToken, isSignedIn, userId };
}



