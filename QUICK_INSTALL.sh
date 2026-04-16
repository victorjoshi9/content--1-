#!/bin/bash

# 🚀 QUICK START: Install Models & Test trconnects
# ==================================================

echo "📊 Drive Analysis Results:"
echo "  Total: 119 GB"
echo "  Used: 42 GB (37%)"
echo "  Available: 72 GB (63%) ✅ EXCELLENT!"
echo ""

echo "📋 QUICK COMMANDS TO GET STARTED:"
echo ""

echo "1️⃣  Install smallest model first (1.6 GB):"
echo "   cd ~/Downloads/content\ \(1\)/trconnects"
echo "   node bin/trconnects pull orca-mini:latest"
echo ""

echo "2️⃣  After install, test it:"
echo "   node bin/trconnects gen 'hello world function' --type python"
echo ""

echo "3️⃣  Chat with the model:"
echo "   node bin/trconnects chat"
echo ""

echo "4️⃣  Install more models (with plenty of space left):"
echo "   node bin/trconnects pull phi:latest              # 2.6 GB"
echo "   node bin/trconnects pull qwen2.5:latest          # 1.5 GB"  
echo "   node bin/trconnects pull neural-chat:latest      # 4.1 GB"
echo "   node bin/trconnects pull qwen2.5-coder:latest    # 3.7 GB"
echo ""

echo "5️⃣  View all installed models:"
echo "   node bin/trconnects list"
echo ""

echo "6️⃣  Generate different types of code:"
echo "   node bin/trconnects gen 'todo list' --type react --output Todo.jsx"
echo "   node bin/trconnects gen 'user API' --type api --output api.py"
echo "   node bin/trconnects gen 'login screen' --type mobile"
echo "   node bin/trconnects gen 'user schema' --type db"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 RECOMMENDED INSTALL ORDER (Total: ~14 GB):"
echo ""
echo "For complete toolkit:"
echo "  1. orca-mini:latest        (1.6 GB) - Start here!"
echo "  2. phi:latest              (2.6 GB) - Lightweight"
echo "  3. qwen2.5:latest          (1.5 GB) - General"
echo "  4. neural-chat:latest      (4.1 GB) - Fast"
echo "  5. qwen2.5-coder:latest    (3.7 GB) - For coding"
echo ""
echo "Total: ~14 GB | Still free: 58 GB ✅"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 ALTERNATIVES:"
echo ""
echo "Option 1: Use Web UI (easier for beginners)"
echo "  • Open: http://localhost:3000"
echo "  • No commands needed"
echo "  • Select model from dropdown"
echo ""

echo "Option 2: Cloud Deployment (free local space)"
echo "  • python deploy_ollama.py"
echo "  • GPU cloud support"
echo "  • Auto-scaling"
echo ""

echo "Option 3: Mix & Match"
echo "  • Keep 2-3 fast models locally"
echo "  • Deploy larger models to cloud"
echo "  • Best of both worlds"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ YOU'RE READY! Pick your approach and start building 🚀"
echo ""
