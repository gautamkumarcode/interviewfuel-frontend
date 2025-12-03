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
import { useState } from "react";
import { useMutation } from "react-query";

interface CreateUserModalProps {
	open: boolean;
	onClose: () => void;
	onUserCreated: () => void;
}

export function CreateUserModal({
	open,
	onClose,
	onUserCreated,
}: CreateUserModalProps) {
	const { toast } = useTheme();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		userName: "",
		password: "",
		role: "user",
		bio: "",
	});

	const createUserMutation = useMutation(
		(userData: typeof formData) => adminUserService.createUser(userData),
		{
			onSuccess: () => {
				toast.success("User created successfully");
				setFormData({
					name: "",
					email: "",
					userName: "",
					password: "",
					role: "user",
					bio: "",
				});
				onUserCreated();
				onClose();
			},
			onError: (error: any) => {
				toast.error(error?.response?.data?.message || "Failed to create user");
			},
		}
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		createUserMutation.mutate(formData);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
					<DialogDescription>
						Add a new user to the system. Fill in all required fields.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="userName">Username *</Label>
							<Input
								id="userName"
								value={formData.userName}
								onChange={(e) =>
									setFormData({ ...formData, userName: e.target.value })
								}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								type="password"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								required
								minLength={6}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="role">Role</Label>
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
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
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
						<Button type="submit" disabled={createUserMutation.isLoading}>
							{createUserMutation.isLoading ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
