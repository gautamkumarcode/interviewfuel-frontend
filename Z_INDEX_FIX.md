# Z-Index Hierarchy Fix - InterviewFuel

## Problem

Modal dialogs, sheets, and drawers were appearing **below** the sidebar and navbar, making them unusable on mobile and desktop.

### Root Cause

Inconsistent z-index values across components:

- **Sidebar (mobile)**: `z-[1001]`
- **Navbar**: `z-[1000]`
- **Sidebar overlay**: `z-[998]`
- **Modals/Dialogs**: `z-50` ❌ (Too low!)

## Solution

Established a clear z-index hierarchy for all overlay components:

### New Z-Index Stack (Bottom to Top)

```
1. Base Layer (z-0 to z-10)
   - Normal page content
   - Static elements

2. Navigation Layer (z-998 to z-1001)
   z-[998]  - Sidebar backdrop overlay (mobile)
   z-[1000] - Navbar
   z-[1001] - Sidebar (mobile)

3. Dropdown Layer (z-1100)
   z-[1100] - Dropdown menus
   z-[1100] - Select dropdowns
   z-[1100] - Tooltips

4. Modal Layer (z-9998 to z-9999) - HIGHEST
   z-[9998] - Modal/Dialog/Sheet overlays (backdrop)
   z-[9999] - Modal/Dialog/Sheet content
   z-[9999] - Loading spinners
   z-[9999] - Mobile search
   z-[9999] - Pause overlay
```

## Files Modified

### Modal Components (z-9998/z-9999)

✅ `components/ui/dialog.tsx`

- Overlay: `z-50` → `z-[9998]`
- Content: `z-50` → `z-[9999]`

✅ `components/ui/sheet.tsx`

- Overlay: `z-50` → `z-[9998]`
- Content: `z-50` → `z-[9999]`

✅ `components/ui/drawer.tsx`

- Overlay: `z-50` → `z-[9998]`
- Content: `z-50` → `z-[9999]`

✅ `components/ui/alert-dialog.tsx`

- Overlay: `z-50` → `z-[9998]`
- Content: `z-50` → `z-[9999]`

### Dropdown Components (z-1100)

✅ `components/ui/dropdown-menu.tsx`

- Content: `z-50` → `z-[1100]`
- SubContent: `z-50` → `z-[1100]`

✅ `components/ui/select.tsx`

- Content: `z-50` → `z-[1100]`

✅ `components/ui/tooltip.tsx`

- Content: `z-50` → `z-[1100]`
- Arrow: `z-50` → `z-[1100]`

### Overlay Components (z-9999)

✅ `components/screens/practicemode/components/PauseOverlay.tsx`

- `z-50` → `z-[9999]`

✅ `components/custom/mobileNav/MobileSearch.tsx`

- `z-50` → `z-[9999]`

✅ `components/custom/loader/LoadingSpinner.tsx`

- `z-50` → `z-[9999]`

## Navigation Layer (No Changes Needed)

✅ `app/(dashboard)/layout.tsx`

- Sidebar overlay: `z-[998]` (correct)
- Navbar: `z-[1000]` (correct)

✅ `components/custom/customsidebar/CustomSidebar.tsx`

- Sidebar (mobile): `z-[1001]` (correct)

## Benefits

✅ **Proper Layering**: Modals now appear above all navigation elements
✅ **Consistent Hierarchy**: Clear z-index progression
✅ **Mobile Fixed**: Sidebar and modals no longer overlap incorrectly
✅ **Dropdown Safety**: Dropdowns appear above navigation but below modals
✅ **Future Proof**: Clear guidelines for new components

## Testing Checklist

### Mobile (< 768px)

- [ ] Open sidebar - should slide in from left
- [ ] Open modal while sidebar open - modal should appear on top
- [ ] Close modal - sidebar should still be visible underneath
- [ ] Close sidebar - backdrop should disappear
- [ ] Open dropdown in navbar - should appear above navbar
- [ ] Open dialog - should appear above everything

### Desktop (≥ 768px)

- [ ] Sidebar toggles between collapsed/expanded
- [ ] Modal opens and covers entire viewport
- [ ] Dropdown menus appear correctly
- [ ] Tooltips show above navigation
- [ ] Loading spinner covers everything

### Specific Components

- [ ] Auth modals (login/signup)
- [ ] Alert dialogs (confirmations)
- [ ] Sheets (side panels)
- [ ] Drawers (bottom sheets)
- [ ] Profile dropdown
- [ ] Category dropdowns
- [ ] Practice mode pause overlay
- [ ] Mobile search overlay

## Z-Index Guidelines for Future Development

### When adding new components:

**Modals/Dialogs** → Use `z-[9999]`

```tsx
<div className="fixed inset-0 z-[9999]">Modal Content</div>
<div className="fixed inset-0 z-[9998] bg-black/50">Overlay</div>
```

**Dropdowns/Popovers** → Use `z-[1100]`

```tsx
<div className="absolute z-[1100]">Dropdown</div>
```

**Navigation Elements** → Use `z-[998-1001]`

```tsx
<nav className="fixed z-[1000]">Navbar</nav>
<aside className="fixed z-[1001]">Sidebar</aside>
```

**Page Content** → Use `z-0` to `z-10`

```tsx
<div className="relative z-10">Content</div>
```

### ⚠️ Avoid These Mistakes:

❌ Using `z-50` for modals
❌ Using `z-[9999]` for dropdowns
❌ Using arbitrary z-index values
❌ Creating multiple overlapping layers at same z-index
❌ Not considering mobile vs desktop behavior

### ✅ Best Practices:

✓ Use predefined z-index values from this hierarchy
✓ Test on both mobile and desktop
✓ Ensure modals have both overlay (z-9998) and content (z-9999)
✓ Keep dropdowns at z-1100 (above nav, below modals)
✓ Document any new z-index layers

## Visual Hierarchy

```
┌─────────────────────────────────────┐
│  Modal Content (z-9999) ← TOP       │
│  ┌───────────────────────────────┐  │
│  │ Modal Overlay (z-9998)        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Dropdown Menu (z-1100)             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Sidebar Mobile (z-1001)            │
├─────────────────────────────────────┤
│  Navbar (z-1000)                    │
├─────────────────────────────────────┤
│  Sidebar Overlay (z-998)            │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Page Content (z-0 to z-10)         │
└─────────────────────────────────────┘
```

---

**Status**: ✅ Fixed and Deployed  
**Impact**: All modals, dialogs, sheets, drawers, and overlays  
**Testing**: Required on mobile and desktop  
**Priority**: HIGH - Critical UX issue
