# 🔀 Development Workflow

## Branch Strategy

### **main** branch (Production)
- ✅ **Stable, deployed version**
- ✅ **Only merge tested, working code**
- ✅ **Auto-deploys to Vercel**
- ❌ **Don't develop directly on main**

### **develop** branch (Development)
- ✅ **Active development branch**
- ✅ **Test new features here**
- ✅ **Safe to break things**
- ✅ **Merge to main when ready**

## Workflow

### Starting New Development

```bash
# Make sure you're on develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, commit
git add .
git commit -m "Add your feature"

# Push to GitHub
git push origin feature/your-feature-name
```

### Merging to Develop

```bash
# After testing your feature branch
git checkout develop
git merge feature/your-feature-name
git push origin develop
```

### Deploying to Production

```bash
# When ready to deploy
git checkout main
git merge develop
git push origin main

# This will trigger Vercel deployment
```

## Current Setup

- **Production**: `main` branch → Auto-deploys to Vercel
- **Development**: `develop` branch → Safe for testing

## Vercel Configuration

Vercel is currently set to deploy from `main` branch. To also deploy `develop`:

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Add `develop` as a preview branch (optional)
3. Or keep it simple: only `main` deploys to production

## Best Practices

1. ✅ **Always develop on `develop` branch**
2. ✅ **Test thoroughly before merging to `main`**
3. ✅ **Use feature branches for big changes**
4. ✅ **Keep `main` stable and deployable**
5. ✅ **Merge `develop` → `main` when ready to deploy**

## Quick Commands

```bash
# Switch to development
git checkout develop

# Switch back to production
git checkout main

# See all branches
git branch -a

# Create new feature branch
git checkout -b feature/new-feature

# Push new branch
git push -u origin feature/new-feature
```


