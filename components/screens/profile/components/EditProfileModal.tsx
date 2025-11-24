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
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/user";
import { Github, Globe, Linkedin, MapPin, Twitter } from "lucide-react";
import { useState } from "react";

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: User;
	onSave: (data: Partial<User>) => Promise<void>;
}

export function EditProfileModal({
	isOpen,
	onClose,
	user,
	onSave,
}: EditProfileModalProps) {
	const [formData, setFormData] = useState({
		name: user.name || "",
		userName: user.userName || "",
		bio: user.bio || "",
		location: user.location || "",
		website: user.website || "",
		social: {
			github: user.social?.github || "",
			linkedin: user.social?.linkedin || "",
			twitter: user.social?.twitter || "",
		},
	});
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.length > 50) {
			newErrors.name = "Name cannot exceed 50 characters";
		}

		if (!formData.userName.trim()) {
			newErrors.userName = "Username is required";
		} else if (formData.userName.length < 3) {
			newErrors.userName = "Username must be at least 3 characters";
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
			newErrors.userName =
				"Username can only contain letters, numbers, and underscores";
		}

		if (formData.bio.length > 500) {
			newErrors.bio = "Bio cannot exceed 500 characters";
		}

		if (formData.location.length > 100) {
			newErrors.location = "Location cannot exceed 100 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSaving(true);
		try {
			await onSave(formData);
			onClose();
		} catch (error) {
			console.error("Failed to save profile:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
					<DialogDescription>
						Update your profile information and social links
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-gray-900">
							Basic Information
						</h3>

						<div className="space-y-2">
							<Label htmlFor="name">
								Name <span className="text-red-500">*</span>
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Your full name"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-red-500">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="userName">
								Username <span className="text-red-500">*</span>
							</Label>
							<Input
								id="userName"
								value={formData.userName}
								onChange={(e) =>
									setFormData({ ...formData, userName: e.target.value })
								}
								placeholder="your_username"
								className={errors.userName ? "border-red-500" : ""}
							/>
							{errors.userName && (
								<p className="text-sm text-red-500">{errors.userName}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								placeholder="Tell us about yourself..."
								rows={4}
								className={errors.bio ? "border-red-500" : ""}
							/>
							<p className="text-xs text-gray-500">
								{formData.bio.length}/500 characters
							</p>
							{errors.bio && (
								<p className="text-sm text-red-500">{errors.bio}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">
								<MapPin className="inline h-4 w-4 mr-1" />
								Location
							</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) =>
									setFormData({ ...formData, location: e.target.value })
								}
								placeholder="City, Country"
								className={errors.location ? "border-red-500" : ""}
							/>
							{errors.location && (
								<p className="text-sm text-red-500">{errors.location}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="website">
								<Globe className="inline h-4 w-4 mr-1" />
								Website
							</Label>
							<Input
								id="website"
								type="url"
								value={formData.website}
								onChange={(e) =>
									setFormData({ ...formData, website: e.target.value })
								}
								placeholder="https://yourwebsite.com"
							/>
						</div>
					</div>

					{/* Social Links */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-gray-900">
							Social Links
						</h3>

						<div className="space-y-2">
							<Label htmlFor="github">
								<Github className="inline h-4 w-4 mr-1" />
								GitHub
							</Label>
							<Input
								id="github"
								value={formData.social.github}
								onChange={(e) =>
									setFormData({
										...formData,
										social: { ...formData.social, github: e.target.value },
									})
								}
								placeholder="https://github.com/username"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="linkedin">
								<Linkedin className="inline h-4 w-4 mr-1" />
								LinkedIn
							</Label>
							<Input
								id="linkedin"
								value={formData.social.linkedin}
								onChange={(e) =>
									setFormData({
										...formData,
										social: { ...formData.social, linkedin: e.target.value },
									})
								}
								placeholder="https://linkedin.com/in/username"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="twitter">
								<Twitter className="inline h-4 w-4 mr-1" />
								Twitter
							</Label>
							<Input
								id="twitter"
								value={formData.social.twitter}
								onChange={(e) =>
									setFormData({
										...formData,
										social: { ...formData.social, twitter: e.target.value },
									})
								}
								placeholder="https://twitter.com/username"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSaving}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
