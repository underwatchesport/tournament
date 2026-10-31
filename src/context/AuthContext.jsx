import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("underwatch_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("underwatch_active_user");
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    return parsed?.role === "admin";
  });

  // Handle incoming OAuth callback params and preserve Discord user profile
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordUsername = params.get("username");
    const discordId = params.get("id");
    const discordAvatar = params.get("avatar");

    if (discordUsername && discordId) {
      const storageKey = `underwatch_profile_${discordId}`;
      const savedProfile = JSON.parse(localStorage.getItem(storageKey) || "{}");
      
      const liveUser = {
        id: discordId,
        username: discordUsername,
        email: `${discordUsername}@discord.com`,
        battleTag: savedProfile.battleTag || "",
        discordTag: discordUsername,
        role: savedProfile.role || "player",
        avatar: discordAvatar,
        primaryRole: savedProfile.primaryRole || "dps",
        sr: savedProfile.sr || 2500
      };
      
      setUser(liveUser);
      setIsAdmin(liveUser.role === "admin");
      
      localStorage.setItem("underwatch_active_user", JSON.stringify(liveUser));
      localStorage.setItem(storageKey, JSON.stringify(liveUser));

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginWithDiscord = () => {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1566207451391594556&response_type=code&redirect_uri=https%3A%2F%2Ftournament-handler-underwatch.vercel.app%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=identify+email";
  };

  const updateUserProfile = (updatedDetails) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedDetails };
      localStorage.setItem("underwatch_active_user", JSON.stringify(updated));
      if (updated.id) {
        localStorage.setItem(`underwatch_profile_${updated.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("underwatch_active_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginWithDiscord,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);