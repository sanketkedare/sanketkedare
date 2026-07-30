# GitHub Actions CI/CD Deployment Setup

This repository is configured with automated GitHub Actions CI/CD pipeline defined in [ci-cd.yml](file://./workflows/ci-cd.yml).

## Pipeline Stages

1. **Lint & Type Check (`lint-and-typecheck`)**: Automatically runs ESLint (`npm run lint`) and TypeScript checks (`npm run type-check`).
2. **Next.js Production Build (`build`)**: Verifies production build with Next.js Turbopack build caching enabled.
3. **Automated Production Deployment (`deploy`)**: Deploys the built application directly to Vercel on `push` to `master` or `main`.

---

## Required GitHub Repository Secrets

To enable automated production deployments to Vercel, add the following secrets in your GitHub Repository under **Settings > Secrets and variables > Actions > New repository secret**:

| Secret Name | Description | How to Find |
|---|---|---|
| `VERCEL_TOKEN` | Personal Access Token for Vercel deployment API | Go to [Vercel Tokens](https://vercel.com/account/tokens) -> Create Token |
| `VERCEL_ORG_ID` | Your Vercel Team / Account ID | Run `npx vercel link` or inspect `.vercel/project.json` (`orgId`) |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID | Run `npx vercel link` or inspect `.vercel/project.json` (`projectId`) |
