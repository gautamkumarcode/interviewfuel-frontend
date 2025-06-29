# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks that ensure code quality before commits.

## Hooks Configured

### Pre-commit Hook
Runs automatically before each commit and performs:

1. **TypeScript Type Checking** - Ensures no type errors
2. **ESLint** - Checks code quality and style
3. **Build** - Verifies the project builds successfully

If any step fails, the commit is blocked until issues are resolved.

### Commit Message Hook
Validates commit messages to ensure they:
- Are not empty
- Have at least 10 characters for meaningful descriptions

## Usage

### Normal Workflow
```bash
# Make your changes
git add .
git commit -m "Add new sidebar component with collapsible categories"
# Hooks run automatically and commit proceeds if all checks pass
```

### If Hooks Fail
```bash
# If linting fails, try auto-fixing
npm run lint:fix

# If type checking fails, fix TypeScript errors
npm run type-check

# If build fails, check build output
npm run build
```

## Available Scripts

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build the project

## Bypassing Hooks (Not Recommended)

In emergency situations only:
```bash
git commit -m "Emergency fix" --no-verify
```

## Benefits

✅ **Prevents broken code** from being committed  
✅ **Maintains code quality** standards  
✅ **Catches errors early** before they reach the repository  
✅ **Ensures consistent** commit message format  
✅ **Automated quality gates** without manual intervention
