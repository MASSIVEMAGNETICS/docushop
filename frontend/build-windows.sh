#!/bin/bash

# DocuShop Windows Build Script
# This script builds the complete Windows desktop application

set -e

echo "================================================"
echo "DocuShop Windows Desktop Application Builder"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "${YELLOW}Step 1: Cleaning previous builds...${NC}"
rm -rf dist dist-electron node_modules/.cache
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Generate icons
echo -e "${YELLOW}Step 2: Generating application icons...${NC}"
node generate-icons.js
node generate-ico.js
echo -e "${GREEN}✓ Icons generated${NC}"
echo ""

# Step 3: Build React application
echo -e "${YELLOW}Step 3: Building React application...${NC}"
npm run build
echo -e "${GREEN}✓ React build complete${NC}"
echo ""

# Step 4: Package Electron application
echo -e "${YELLOW}Step 4: Packaging Electron application for Windows...${NC}"
npm run electron:build:win
echo -e "${GREEN}✓ Electron packaging complete${NC}"
echo ""

# Step 5: Display results
echo "================================================"
echo -e "${GREEN}Build Complete!${NC}"
echo "================================================"
echo ""
echo "Build artifacts location: dist-electron/"
echo ""
echo "Windows installers created:"
ls -lh dist-electron/*.exe 2>/dev/null || echo "  (Note: .exe files may not be created on non-Windows platforms)"
echo ""
echo "To distribute:"
echo "  1. Test the installer on a Windows 10 machine"
echo "  2. Upload to GitHub releases"
echo "  3. Provide download links to users"
echo ""
echo "Installation guide: WINDOWS_INSTALLATION.md"
echo "Developer guide: ELECTRON_README.md"
echo ""
