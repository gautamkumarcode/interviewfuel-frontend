"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/theme.context";
import { adminUserService } from "@/services/admin/admin-user-service";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useMutation } from "react-query";
import { EditUserModal } from "./EditUserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";

interface User {
	_id: string;
	name: string;
	email: string;
	userName: string;
	role: string;
	isActive: boolean;
	createdAt: string;
}

interface UserManagementTableProps {
	users: User[];
	loading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onUserUpdated: () => void;
}

export function UserManagementTable({
	users,
	loading,
	page,
	totalPages,
	onPageChange,
	onUserUpdated,
}: UserManagementTableProps) {
	const { toast } = useTheme();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
		useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const toggleStatusMutation = useMutation(
		(userId: string) => adminUserService.toggleUserStatus(userId),
		{
			onSuccess: (data) => {
				toast.success(data.message);
				onUserUpdated();
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data?.message || "Failed to toggle user status"
				);
			},
		}
	);

	const deleteUserMutation = useMutation(
		(userId: string) => adminUserService.deleteUser(userId),
		{
			onSuccess: (data) => {
				toast.success(data.message);
				onUserUpdated();
				setIsDeleteDialogOpen(false);
			},
			onError: (error: any) => {
				toast.error(error?.response?.data?.message || "Failed to delete user");
			},
		}
	);

	const handleToggleStatus = (userId: string) => {
		toggleStatusMutation.mutate(userId);
	};

	const handleDeleteUser = () => {
		if (!selectedUser) return;
		deleteUserMutation.mutate(selectedUser._id);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8">
									No users found
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user._id}>
									<TableCell className="font-medium">{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.userName}</TableCell>
									<TableCell>
										<Badge
											variant={user.role === "admin" ? "default" : "secondary"}>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={user.isActive ? "default" : "destructive"}>
											{user.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
									<TableCell>
										{format(new Date(user.createdAt), "MMM dd, yyyy")}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() => {
														setSelectedUser(user);
														setIsEditModalOpen(true);
													}}>
													Edit User
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setSelectedUser(user);
														setIsResetPasswordModalOpen(true);
													}}>
													Reset Password
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleToggleStatus(user._id)}
													disabled={toggleStatusMutation.isLoading}>
													{user.isActive ? "Deactivate" : "Activate"}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setSelectedUser(user);
														setIsDeleteDialogOpen(true);
													}}
													className="text-red-600">
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					Page {page} of {totalPages}
				</p>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}>
						Next
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</div>
			</div>

			{selectedUser && (
				<>
					<EditUserModal
						user={selectedUser}
						open={isEditModalOpen}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedUser(null);
						}}
						onUserUpdated={onUserUpdated}
					/>

					<ResetPasswordModal
						user={selectedUser}
						open={isResetPasswordModalOpen}
						onClose={() => {
							setIsResetPasswordModalOpen(false);
							setSelectedUser(null);
						}}
					/>

					<AlertDialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									user account for <strong>{selectedUser.name}</strong> and
									remove all their data from the system.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteUser}
									disabled={deleteUserMutation.isLoading}
									className="bg-red-600 hover:bg-red-700">
									{deleteUserMutation.isLoading ? "Deleting..." : "Delete"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</>
	);
}
