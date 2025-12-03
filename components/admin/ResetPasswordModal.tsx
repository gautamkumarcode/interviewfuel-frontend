"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme.context";
import { adminUserService } from "@/services/admin/admin-user-service";
import { useState } from "react";
import { useMutation } from "react-query";

interface User {
	_id: string;
	name: string;
	email: string;
}

interface ResetPasswordModalProps {
	user: User;
	open: boolean;
	onClose: () => void;
}

export function ResetPasswordModal({
	user,
	open,
	onClose,
}: ResetPasswordModalProps) {
	const { toast } = useTheme();
	const [newPassword, setNewPassword] = useState("");

	const resetPasswordMutation = useMutation(
		(password: string) =>
			adminUserService.resetUserPassword(user._id, password),
		{
			onSuccess: () => {
				toast.success("Password reset successfully");
				setNewPassword("");
				onClose();
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data?.message || "Failed to reset password"
				);
			},
		}
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		resetPasswordMutation.mutate(newPassword);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Reset Password</DialogTitle>
					<DialogDescription>
						Reset password for <strong>{user.name}</strong> ({user.email})
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="newPassword">New Password *</Label>
							<Input
								id="newPassword"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								minLength={6}
								placeholder="Enter new password (min 6 characters)"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={resetPasswordMutation.isLoading}>
							{resetPasswordMutation.isLoading
								? "Resetting..."
								: "Reset Password"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
