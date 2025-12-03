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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/theme.context";
import { adminUserService } from "@/services/admin/admin-user-service";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

interface User {
	_id: string;
	name: string;
	email: string;
	userName: string;
	role: string;
	bio?: string;
}

interface EditUserModalProps {
	user: User;
	open: boolean;
	onClose: () => void;
	onUserUpdated: () => void;
}

export function EditUserModal({
	user,
	open,
	onClose,
	onUserUpdated,
}: EditUserModalProps) {
	const { toast } = useTheme();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		userName: "",
		role: "user",
		bio: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				userName: user.userName,
				role: user.role,
				bio: user.bio || "",
			});
		}
	}, [user]);

	const updateUserMutation = useMutation(
		(userData: typeof formData) =>
			adminUserService.updateUser(user._id, userData),
		{
			onSuccess: () => {
				toast.success("User updated successfully");
				onUserUpdated();
				onClose();
			},
			onError: (error: any) => {
				toast.error(error?.response?.data?.message || "Failed to update user");
			},
		}
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		updateUserMutation.mutate(formData);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>
						Update user information. Leave password empty to keep current
						password.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-name">Name *</Label>
							<Input
								id="edit-name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-email">Email *</Label>
							<Input
								id="edit-email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-userName">Username *</Label>
							<Input
								id="edit-userName"
								value={formData.userName}
								onChange={(e) =>
									setFormData({ ...formData, userName: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-role">Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="edit-bio">Bio</Label>
							<Textarea
								id="edit-bio"
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={updateUserMutation.isLoading}>
							{updateUserMutation.isLoading ? "Updating..." : "Update User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
