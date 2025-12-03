"use client";

import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { UserStats } from "@/components/admin/UserStats";
import { AdminOnly } from "@/components/common/AdminOnly";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { adminUserService } from "@/services/admin/admin-user-service";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

export default function AdminUsersPage() {
	return (
		<AdminOnly>
			<UserManagementContent />
		</AdminOnly>
	);
}

function UserManagementContent() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Fetch users with react-query
	const {
		data: usersData,
		isLoading: usersLoading,
		refetch: refetchUsers,
	} = useQuery(
		["admin-users", page, search, roleFilter, statusFilter],
		() =>
			adminUserService.getUsers({
				page,
				limit: 10,
				...(search && { search }),
				...(roleFilter && { role: roleFilter }),
				...(statusFilter && { status: statusFilter }),
			}),
		{
			keepPreviousData: true,
		}
	);

	// Fetch stats with react-query
	const { data: statsData, refetch: refetchStats } = useQuery(
		["admin-users-stats"],
		() => adminUserService.getUserStats()
	);

	const handleUserUpdated = () => {
		refetchUsers();
		refetchStats();
	};

	const users = usersData?.data?.users || [];
	const totalPages = usersData?.data?.pagination?.pages || 1;
	const stats = statsData?.data?.stats;

	return (
		<div className="container mx-auto py-8 space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">User Management</h1>
					<p className="text-muted-foreground">
						Manage all users and their permissions
					</p>
				</div>
				<Button onClick={() => setIsCreateModalOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Create User
				</Button>
			</div>

			{stats && <UserStats stats={stats} />}

			<div className="flex gap-4 flex-wrap">
				<div className="flex-1 min-w-[200px]">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name, email, or username..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="pl-10"
						/>
					</div>
				</div>

				<Select
					value={roleFilter || "all"}
					onValueChange={(value) => {
						setRoleFilter(value === "all" ? "" : value);
						setPage(1);
					}}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Filter by role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="user">User</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={statusFilter || "all"}
					onValueChange={(value) => {
						setStatusFilter(value === "all" ? "" : value);
						setPage(1);
					}}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<UserManagementTable
				users={users}
				loading={usersLoading}
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				onUserUpdated={handleUserUpdated}
			/>

			<CreateUserModal
				open={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onUserCreated={handleUserUpdated}
			/>
		</div>
	);
}
