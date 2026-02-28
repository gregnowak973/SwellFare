# 📦 Installing Node.js for Local Development

## Option 1: Install via Homebrew (Recommended for macOS)

If you have Homebrew installed:

```bash
brew install node
```

This will install both Node.js and npm.

## Option 2: Download from Node.js Website

1. Go to: https://nodejs.org
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Follow the installation wizard

## Option 3: Install Homebrew First (if not installed)

If you don't have Homebrew:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js
brew install node
```

## Verify Installation

After installing, verify it works:

```bash
node --version
npm --version
```

You should see version numbers (e.g., `v20.x.x` and `10.x.x`).

## After Installation

Once Node.js is installed, you can:

```bash
cd /Users/gregnowak/Documents/GitHub/SwellFare
npm install
npm run dev
```

Then open: **http://localhost:3000**

## Quick Install Command

If you have Homebrew, just run:
```bash
brew install node
```

This is the fastest way to get Node.js on macOS!


