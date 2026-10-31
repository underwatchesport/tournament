import React, { createContext, useContext, useState } from "react";
import { AUTH_CONFIG } from "../utils/constants.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loginWithEmail = (email, password) => {
    // Check for admin credentials
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

    // Standard user login mock
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

  const loginWithDiscord = () => {
    const discordUser = {
      id: "usr_discord_999",
      username: "GamerPro",
      email: "gamer@discord.com",
      battleTag: "GenjiGod#5678",
      discordTag: "GamerPro#9999",
      role: "player",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
    };
    setUser(discordUser);
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