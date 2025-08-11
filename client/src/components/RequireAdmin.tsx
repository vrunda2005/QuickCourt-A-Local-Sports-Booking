// src/components/RequireAdmin.tsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ADMIN_EMAIL } from "../config/admin";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null; // or a loader component

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  const email =
    (user as any)?.primaryEmailAddress?.emailAddress ??
    (user as any)?.emailAddresses?.[0]?.emailAddress ??
    "";

  // Optionally also check user.publicMetadata.role === 'admin' if you set that on the backend
  if (email === ADMIN_EMAIL || (user as any)?.publicMetadata?.role === "admin") {
    return children;
  }

  return <Navigate to="/not-authorized" replace />;
}
