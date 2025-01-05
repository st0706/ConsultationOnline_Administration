"use client";

import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useState } from "react";
import { create } from "zustand";

type AuthUser = {
  user: User | null;
  session: any | null;
};

type AuthStore = {
  authenticated: boolean;
  authUser?: AuthUser | null;
  setAuthUser: (user?: AuthUser | null) => void;
  reset: () => void;
};

const createAuthStore = (authUser?: AuthUser | null) =>
  create<AuthStore>((set) => ({
    authenticated: false,
    authUser,
    setAuthUser: (user) => set((state) => ({ ...state, authUser: user, authenticated: true })),
    reset: () => set({ authenticated: false, authUser: undefined })
  }));

export const AuthContext = createContext<ReturnType<typeof createAuthStore> | null>(null);

export const useAuthStore = () => {
  if (!AuthContext) {
    throw new Error("useAuthStore must be used within a AuthProvider");
  }
  return useContext(AuthContext)!;
};

const AuthProvider = ({ authUser, children }: { authUser?: AuthUser | null; children: React.ReactNode }) => {
  const [store] = useState(() => createAuthStore(authUser));

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
