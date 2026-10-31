import React, { createContext, useContext, useState, useEffect } from "react";
import { AUTH_CONFIG } from "../utils/constants.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // START WITH NULL USER - NO MOCK ACCOUNT DEFAULT
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check URL parameters when Discord redirects back to the site
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordUsername = params.get("username");
    const discordId = params.get("id");
    const discordAvatar = params.get("avatar");

    if (discordUsername && discordId) {
      const liveUser = {
        id: `discord_${discordId}`,
        username: discordUsername,
        email: `${discordUsername}@discord.com`,
        battleTag: `${discordUsername}#0000`,
        discordTag: `${discordUsername}`,
        role: "player",
        avatar: discordAvatar
      };
      setUser(liveUser);
      setIsAdmin(false);

      // Clean parameters from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginWithDiscord = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || AUTH_CONFIG.discordClientId;
    const redirectUri = encodeURIComponent(
      window.location.origin + "/api/auth/discord/callback"
    );
    const scope = encodeURIComponent("identify email");

    // Force browser redirect directly to Discord's official consent screen
    window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  };

  const loginWithEmail = (email, password) => {
    if (
      email === AUTH_CONFIG.adminCredentials.username &&
      password === AUTH_CONFIG.adminCredentials.password
    ) {
      const adminUser = {
        id: "usr_admin_001",
        username: "Admin",
        email: "admin@underwatch.gg",
        battleTag: "Admin#1337",
        discordTag: "Admin#0001",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop"
      };
      setUser(adminUser);
      setIsAdmin(true);
      return { success: true, isAdmin: true };
    }

    const standardUser = {
      id: "usr_std_001",
      username: email.split("@")[0],
      email: email,
      battleTag: "Tracer#11223",
      discordTag: `${email.split("@")[0]}#1234`,
      role: "player",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
    };
    setUser(standardUser);
    setIsAdmin(false);
    return { success: true, isAdmin: false };
  };

  const signUp = (username, email, battleTag, discordTag) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      username,
      email,
      battleTag,
      discordTag,
      role: "player",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop"
    };
    setUser(newUser);
    setIsAdmin(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const updateUserProfile = (updatedDetails) => {
    setUser((prev) => ({ ...prev, ...updatedDetails }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginWithEmail,
        loginWithDiscord,
        signUp,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);