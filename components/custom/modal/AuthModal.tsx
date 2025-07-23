"use client";

import LoginForm from "@/components/screens/login/components/Form";
import { SignupForm } from "@/components/screens/signup/component/Form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useAuthModal } from "@/context/AuthModalContext";

export const AuthModal = () => {
    const { isOpen, closeModal, view } = useAuthModal();

    return (
        <div>

        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-lg w-full p-0 bg-transparent border-none shadow-none">
                <DialogTitle>{""}</DialogTitle>
                {view === "login" ? <LoginForm onSuccess={closeModal} /> : <SignupForm onSuccess={closeModal} />}
            </DialogContent>
        </Dialog>
        </div>
    );
};
