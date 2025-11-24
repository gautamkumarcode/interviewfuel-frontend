# Profile Management System

## Overview

Professional profile management system with full editing capabilities, avatar upload, preferences management, and data export.

## Features Implemented

### 1. Profile Editing

- **Edit Profile Modal** - Full-featured modal for editing profile information
- **Fields**: Name, Username, Bio, Location, Website, Social Links (GitHub, LinkedIn, Twitter)
- **Validation**: Client-side validation for all fields
- **Real-time Updates**: Changes reflect immediately after saving

### 2. Avatar Management

- **Upload Avatar**: Click on avatar to upload new image
- **Delete Avatar**: Remove current profile picture
- **File Validation**: Image type and size (max 5MB) validation
- **Hover Actions**: Upload/delete buttons appear on hover

### 3. Preferences Management

- **Notification Settings**:
  - Email Notifications
  - Push Notifications
  - Weekly Digest
  - Practice Reminders
- **Privacy Settings**:
  - Public Profile
  - Show Statistics
- **Auto-save**: Preferences save automatically on toggle

### 4. Data Export

- Export all user data as JSON file
- Includes: Profile, Stats, Achievements, Preferences
- One-click download

### 5. Account Management

- Change Password (existing feature)
- Delete Account (soft delete - marks as inactive)

## Components

### Frontend Components

#### ProfileHeaderNew

`frontend/components/screens/profile/components/ProfileHeaderNew.tsx`

- Displays user profile header with avatar
- Avatar upload/delete functionality
- Edit profile button
- Share profile button
- Social links display

#### EditProfileModal

`frontend/components/screens/profile/components/EditProfileModal.tsx`

- Modal dialog for editing profile
- Form validation
- Organized sections (Basic Info, Social Links)
- Character counters for text fields

#### SettingsTabNew

`frontend/components/screens/profile/components/SettingsTabNew.tsx`

- Notification preferences toggles
- Privacy settings toggles
- Export data button
- Auto-save on toggle

### Backend Endpoints

All endpoints require authentication (`auth` middleware).

#### Update Profile

```
PUT /auth/profile
Body: { name, userName, bio, location, website, social }
```

#### Upload Avatar

```
POST /auth/avatar
Body: FormData with 'avatar' file
Note: Currently returns 501 - needs file storage integration
```

#### Delete Avatar

```
DELETE /auth/avatar
```

#### Update Preferences

```
PUT /auth/preferences
Body: { preferences }
```

#### Export Data

```
GET /auth/export-data
Returns: JSON file download
```

#### Delete Account

```
DELETE /auth/account
Body: { password }
```

## Services

### userServices

`frontend/services/userservices/user-services.ts`

Methods:

- `getUserProfile()` - Get current user profile
- `updateProfile(data)` - Update profile information
- `uploadAvatar(file)` - Upload profile picture
- `deleteAvatar()` - Remove profile picture
- `updatePreferences(preferences)` - Update user preferences
- `changePassword(current, new)` - Change password
- `deleteAccount(password)` - Delete user account
- `exportData()` - Export user data

## Usage

### Edit Profile

1. Click "Edit Profile" button in profile header
2. Update desired fields in modal
3. Click "Save Changes"
4. Profile updates immediately

### Change Avatar

1. Hover over avatar
2. Click camera icon to upload new image
3. Or click X icon to remove current avatar

### Update Preferences

1. Go to Settings tab
2. Toggle any preference switch
3. Changes save automatically

### Export Data

1. Go to Settings tab
2. Click "Export My Data" button
3. JSON file downloads automatically

## TODO / Future Enhancements

1. **Avatar Upload**: Integrate with file storage service (AWS S3, Cloudinary, etc.)
2. **Password Change UI**: Add modal for changing password
3. **Delete Account Confirmation**: Add proper confirmation dialog with password input
4. **Profile Picture Cropper**: Add image cropping before upload
5. **Social Link Validation**: Validate social media URLs
6. **Activity Feed**: Real-time activity updates
7. **Achievement Notifications**: Toast notifications for new achievements

## Security Notes

- All endpoints require authentication
- Username uniqueness is validated server-side
- Password required for account deletion
- Account deletion is soft delete (marks inactive, doesn't remove data)
- File upload validation (type and size)

## Testing

To test the profile management:

1. Login to your account
2. Navigate to `/profile`
3. Try editing profile information
4. Toggle preferences in Settings tab
5. Export your data
6. Test avatar upload (note: currently returns 501)
