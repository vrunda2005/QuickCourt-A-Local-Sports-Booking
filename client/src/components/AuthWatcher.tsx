// src/components/AuthWatcher.tsx
import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ADMIN_EMAIL } from "../config/admin";

export default function AuthWatcher() {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Only run the redirect when we are coming from the sign-in / sign-up flow,
    // so we don't redirect on every app load.
    if (!location.pathname.startsWith("/sign-in") && !location.pathname.startsWith("/sign-up")) {
      return;
    }

    // Get the user's primary email safely (Clerk exposes primaryEmailAddress)
    const email =
      (user as any)?.primaryEmailAddress?.emailAddress ??
      (user as any)?.emailAddresses?.[0]?.emailAddress ??
      "";

    if (email === ADMIN_EMAIL) {
      navigate("/admin/profile", { replace: true });
    } else {
      // Prevent non-admins from auto-entering admin area.
      // You can change this to navigate("/") or show a message.
      navigate("/not-authorized", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, location.pathname, navigate]);

  return null;
}
