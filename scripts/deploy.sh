#!/bin/bash

echo "🚀 FanMerch AI Deployment Script"
echo "=================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Run type checks
echo ""
echo "📝 Running type checks..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix errors before deploying."
    exit 1
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Ask for confirmation
echo ""
echo "✅ Build successful!"
echo ""
read -p "Deploy to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Verify environment variables in Vercel Dashboard"
        echo "2. Update Stripe webhook URL to production domain"
        echo "3. Test the live site"
        echo "4. Run database migrations if needed: npx prisma db push"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "Deployment cancelled."
    exit 0
fi
