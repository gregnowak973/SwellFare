#!/bin/bash

# SwellFare Vercel Deployment Helper Script

echo "🚀 SwellFare Vercel Deployment Setup"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Run: vercel"
echo "2. Follow the prompts"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Connect your domain: swellfare.ai"
echo ""
echo "Or deploy via dashboard: https://vercel.com/new"

