import { useState } from "react";

export const useAuthModalController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setView("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setView("signup");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    view,
    openLogin,
    openSignup,
    closeModal,
  };
};
