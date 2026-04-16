#!/bin/bash

# 🎯 COMPLETE TRCONNECTS SETUP SCRIPT
# ====================================
# This script sets up your entire AI development environment

set -e  # Exit on error

PROJECT_DIR="/home/madhusudan/Downloads/content (1)/trconnects"
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
COLOR_NC='\033[0m' # No Color

echo -e "${COLOR_BLUE}╔════════════════════════════════════════════════════════╗${COLOR_NC}"
echo -e "${COLOR_BLUE}║                                                        ║${COLOR_NC}"
echo -e "${COLOR_BLUE}║     🚀 TRCONNECTS - COMPLETE SETUP & INSTALLATION     ║${COLOR_NC}"
echo -e "${COLOR_BLUE}║          Setting up your AI development platform      ║${COLOR_NC}"
echo -e "${COLOR_BLUE}║                                                        ║${COLOR_NC}"
echo -e "${COLOR_BLUE}╚════════════════════════════════════════════════════════╝${COLOR_NC}"

echo ""
echo -e "${COLOR_YELLOW}📊 System Check${COLOR_NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

echo -e "${COLOR_GREEN}✓${COLOR_NC} Project location confirmed"
echo -e "${COLOR_GREEN}✓${COLOR_NC} Working directory: $PROJECT_DIR"

# Check CLI
if node bin/trconnects -v > /dev/null 2>&1; then
    VERSION=$(node bin/trconnects -v)
    echo -e "${COLOR_GREEN}✓${COLOR_NC} trconnects CLI ready (v$VERSION)"
else
    echo -e "${COLOR_YELLOW}⚠${COLOR_NC} Installing CLI dependencies..."
    npm install > /dev/null 2>&1
    echo -e "${COLOR_GREEN}✓${COLOR_NC} Dependencies installed"
fi

# Check Ollama
if node bin/trconnects status 2>&1 | grep -q "Connected"; then
    echo -e "${COLOR_GREEN}✓${COLOR_NC} Ollama API connected (localhost:11434)"
else
    echo -e "${COLOR_YELLOW}⚠${COLOR_NC} Ollama not responding, check if running"
fi

echo ""
echo -e "${COLOR_YELLOW}📦 Available Models${COLOR_NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node bin/trconnects list 2>/dev/null || echo "No models installed yet"

echo ""
echo -e "${COLOR_YELLOW}💾 Space Available${COLOR_NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
df -h / | tail -1 | awk '{printf "Total: %s | Used: %s | Available: %s | %%Full: %s\n", $2, $3, $4, $5}'

echo ""
echo -e "${COLOR_GREEN}✅ SETUP COMPLETE!${COLOR_NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo -e "${COLOR_BLUE}🎯 NEXT STEPS:${COLOR_NC}"
echo ""
echo "1. Install a model (choose one):"
echo -e "   ${COLOR_YELLOW}Small (fastest start):${COLOR_NC}"
echo "   node bin/trconnects pull orca-mini:latest"
echo ""
echo -e "   ${COLOR_YELLOW}Balanced:${COLOR_NC}"
echo "   node bin/trconnects pull phi:latest"
echo "   node bin/trconnects pull qwen2.5:latest"
echo ""
echo -e "   ${COLOR_YELLOW}Fast & Powerful:${COLOR_NC}"
echo "   node bin/trconnects pull neural-chat:latest"
echo "   node bin/trconnects pull qwen2.5-coder:latest"
echo ""

echo "2. After installation, generate code:"
echo "   node bin/trconnects gen 'react button' --type react"
echo ""

echo "3. Or chat interactively:"
echo "   node bin/trconnects chat"
echo ""

echo "4. Or open web UI:"
echo "   http://localhost:3000"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${COLOR_GREEN}Ready to build with AI! 🎉${COLOR_NC}"
