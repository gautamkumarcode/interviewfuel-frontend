"use client";

import AuthTabs from "@/components/screens/auth/AuthTabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthModal } from "@/context/AuthModalContext";

export const AuthModal = () => {
    const { isOpen, closeModal, view } = useAuthModal();

    return (
        <div>
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-lg w-full p-0 bg-transparent border-none shadow-none">
                <DialogTitle>{""}</DialogTitle>
                <AuthTabs initialTab={view} onSuccess={closeModal} />
            </DialogContent>
        </Dialog>
        </div>
    );
};
