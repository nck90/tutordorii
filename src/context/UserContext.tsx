"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "student" | "tutor" | null;

interface UserContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    isLoggedIn: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<UserRole>(null);

    // Persist for demo purposes
    useEffect(() => {
        const savedRole = localStorage.getItem("demo_role") as UserRole;
        if (savedRole) setRoleState(savedRole);
    }, []);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        if (newRole) localStorage.setItem("demo_role", newRole);
        else localStorage.removeItem("demo_role");
    };

    const logout = () => setRole(null);

    return (
        <UserContext.Provider value={{ role, setRole, isLoggedIn: !!role, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
