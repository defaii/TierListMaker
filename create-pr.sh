#!/bin/bash

# Script to create a pull request automatically
# Usage: npm run create-pr

echo "🚀 Creating Pull Request..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Not authenticated with GitHub. Starting authentication..."
    gh auth login
fi

# Create the PR
gh pr create \
  --repo defaii/TierListMaker \
  --base main \
  --head TojiiSamaa:feature/comprehensive-improvements \
  --title "Comprehensive improvements: UI/UX, code quality, security, and accessibility" \
  --body "## Overview
This PR introduces comprehensive improvements across the entire TierListMaker application.

## Visual & UX Improvements
- ✨ Complete UI redesign with modern design system (custom.css)
- 🎨 New gradient header with improved typography
- 🖼️ Grid layout for images with responsive breakpoints
- 💫 Smooth animations and transitions
- 🎯 Visual drag & drop zones with hover effects
- 📱 Mobile-first responsive design

## New Components
- **ErrorBoundary.jsx** - Catches React errors with fallback UI
- **LoadingSpinner.jsx** - Reusable loading indicator (3 sizes)
- **ConfirmDialog.jsx** - Modal for destructive action confirmations

## Code Quality
- 🧹 Removed unused dependencies and components
- 🔧 Centralized API configuration (apiConfig.js)
- 🚫 Removed all console.log statements
- ✅ Improved error handling

## Security Enhancements
- 🛡️ Added helmet middleware for security headers
- ⏱️ Rate limiting (100 req/15min per IP)
- 🔐 UUID-based secure filename generation
- 📋 MIME type validation for uploads

## Accessibility
- ♿ ARIA attributes throughout
- ⌨️ Keyboard navigation support (Tab, Enter, ESC)
- 🔍 Screen reader improvements
- 🎯 Focus visible states

## Documentation
- 📚 Comprehensive README with API docs
- ⚙️ .env.example for configuration
- 📝 Updated metadata

## Development Experience
- 🔄 Added \`npm run dev\` to launch both servers concurrently
- 📦 Uses concurrently for parallel server execution
- 🎨 Color-coded terminal output (API=blue, APP=green)

## Technical Changes
- 21 files changed: 3,314 insertions(+), 313 deletions(-)
- Added dependencies: express-rate-limit, helmet, concurrently
- All improvements tested and ready for review!"

echo "✅ Pull Request created successfully!"
