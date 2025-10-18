#!/bin/bash

echo "========================================="
echo "📦 GITHUB PUSH GUIDE"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}This guide will help you push your code to GitHub safely.${NC}"
echo ""

# Step 1: Security Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Security Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Checking if .env files are ignored..."
if git check-ignore .env frontend/.env > /dev/null 2>&1; then
    echo -e "${GREEN}✅ .env files are properly ignored${NC}"
else
    echo -e "${RED}❌ WARNING: .env files might not be ignored!${NC}"
    echo "   Run: git add .gitignore"
    exit 1
fi

echo ""
echo "Searching for hardcoded credentials..."
MONGO_CHECK=$(grep -r "mongodb+srv://" src/ frontend/src/ 2>/dev/null | grep -v ".example" | wc -l)
if [ "$MONGO_CHECK" -eq 0 ]; then
    echo -e "${GREEN}✅ No MongoDB credentials in source code${NC}"
else
    echo -e "${RED}❌ WARNING: Found MongoDB credentials in code!${NC}"
    grep -r "mongodb+srv://" src/ frontend/src/ 2>/dev/null | grep -v ".example"
    exit 1
fi

API_KEY_CHECK=$(grep -r "gsk_" src/ frontend/src/ 2>/dev/null | wc -l)
if [ "$API_KEY_CHECK" -eq 0 ]; then
    echo -e "${GREEN}✅ No API keys in source code${NC}"
else
    echo -e "${RED}❌ WARNING: Found API keys in code!${NC}"
    grep -r "gsk_" src/ frontend/src/ 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All security checks passed!${NC}"
echo ""

# Step 2: Git Repository Setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Git Repository Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository already initialized${NC}"
else
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

echo ""
echo -e "${BLUE}If you haven't created a GitHub repository yet:${NC}"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: sports-event-platform (or your choice)"
echo "3. Description: Sports Event Management Platform"
echo "4. Keep it Public or Private"
echo "5. DON'T initialize with README (we have one)"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter when you've created the GitHub repository..."
echo ""

# Step 3: Configure Git Remote
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Configure Git Remote"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter your repository name (e.g., sports-event-platform): " REPO_NAME

REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

if git remote | grep -q "origin"; then
    echo -e "${YELLOW}Remote 'origin' already exists. Updating...${NC}"
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

echo -e "${GREEN}✅ Remote configured: $REMOTE_URL${NC}"
echo ""

# Step 4: Review Files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Review Files to be Committed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git status

echo ""
read -p "Review the files above. Continue? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ]; then
    echo "Aborted by user."
    exit 0
fi
echo ""

# Step 5: Stage and Commit
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Stage and Commit Changes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Staging all files..."
git add .

echo ""
echo "Files staged. Creating commit..."
git commit -m "Initial commit: Sports Event Management Platform

Features:
- User authentication and authorization (JWT)
- Event management (CRUD operations)
- Event registration and requests
- Admin dashboard with statistics
- User management for admins
- Resource library
- Ratings and reviews
- Google Maps integration
- Dark mode theme
- Responsive design

Tech Stack:
- Backend: Spring Boot 3.4.0, MongoDB, Spring Security
- Frontend: React 18, React Router, Axios
- Database: MongoDB Atlas
- Authentication: JWT tokens"

echo -e "${GREEN}✅ Commit created successfully${NC}"
echo ""

# Step 6: Push to GitHub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 6: Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Pushing to GitHub..."
echo "(You may be prompted for your GitHub credentials)"
echo ""

# Try to push
if git push -u origin master; then
    echo ""
    echo "========================================="
    echo -e "${GREEN}✅ SUCCESS! CODE PUSHED TO GITHUB${NC}"
    echo "========================================="
    echo ""
    echo "Your repository is now available at:"
    echo "https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Update the README if needed"
    echo "3. Set up branch protection (Settings > Branches)"
    echo "4. Add collaborators if working in a team"
    echo "5. Consider setting up GitHub Actions for CI/CD"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Push failed${NC}"
    echo ""
    echo "Common issues:"
    echo "1. GitHub authentication - Use personal access token"
    echo "2. Repository doesn't exist - Create it on GitHub first"
    echo "3. Wrong remote URL - Check with: git remote -v"
    echo ""
    echo "To fix authentication:"
    echo "1. Generate a personal access token:"
    echo "   https://github.com/settings/tokens"
    echo "2. Use token as password when prompted"
    echo ""
fi

# Step 7: Final Checklist
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "FINAL CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "After pushing, verify on GitHub:"
echo "- [ ] No .env files visible"
echo "- [ ] No credentials in code (search 'mongodb', 'password')"
echo "- [ ] README.md is displayed properly"
echo "- [ ] All source files are present"
echo "- [ ] .gitignore is working"
echo ""
echo "Clean up local files:"
echo "- [ ] Delete SECURITY_CHECKLIST.md (contains sensitive info)"
echo "- [ ] Delete README_NEW.md (if you chose to use it)"
echo "- [ ] Keep .env file locally (never push it)"
echo ""
echo -e "${GREEN}✅ All done! Happy coding! 🚀${NC}"
echo ""
