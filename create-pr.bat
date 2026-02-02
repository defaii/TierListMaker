@echo off
REM Script to create a pull request automatically
REM Usage: npm run create-pr

echo 🚀 Creating Pull Request...

REM Check if gh CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ GitHub CLI (gh) is not installed.
    echo 📥 Install it from: https://cli.github.com/
    exit /b 1
)

REM Check if authenticated
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Not authenticated with GitHub. Starting authentication...
    gh auth login
)

REM Create the PR
gh pr create --repo defaii/TierListMaker --base main --head TojiiSamaa:feature/comprehensive-improvements --title "Comprehensive improvements: UI/UX, code quality, security, and accessibility" --body "## Overview\nThis PR introduces comprehensive improvements across the entire TierListMaker application.\n\n## Visual & UX Improvements\n- ✨ Complete UI redesign with modern design system\n- 🎨 New gradient header with improved typography\n- 🖼️ Grid layout for images with responsive breakpoints\n- 💫 Smooth animations and transitions\n- 🎯 Visual drag & drop zones\n- 📱 Mobile-first responsive design\n\n## New Components\n- ErrorBoundary.jsx - Error handling\n- LoadingSpinner.jsx - Loading indicator\n- ConfirmDialog.jsx - Confirmation dialogs\n\n## Code Quality\n- 🧹 Removed unused dependencies\n- 🔧 Centralized API configuration\n- 🚫 Removed console.log statements\n- ✅ Improved error handling\n\n## Security\n- 🛡️ Helmet middleware\n- ⏱️ Rate limiting\n- 🔐 UUID-based filenames\n- 📋 MIME validation\n\n## Accessibility\n- ♿ ARIA attributes\n- ⌨️ Keyboard navigation\n- 🔍 Screen reader support\n\n## Development\n- 🔄 npm run dev for both servers\n- 📦 Concurrently package\n- 🎨 Color-coded output\n\n21 files changed: 3,314+ / 313-"

echo ✅ Pull Request created successfully!
