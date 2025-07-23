"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ViewType = "login" | "signup";

interface AuthModalContextType {
    isOpen: boolean;
    view: ViewType;
    openModal: (view: ViewType) => void;
    closeModal: () => void;
    setView: (view: ViewType) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<ViewType>("login");

    const openModal = (viewType: ViewType) => {
        setView(viewType);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <AuthModalContext.Provider value={{ isOpen, view, openModal, closeModal, setView }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return context;
};
