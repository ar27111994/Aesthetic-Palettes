# Deployment Plan: AestheticPalettes

## 1. Introduction

This document outlines the deployment plan for the AestheticPalettes application, as per task T029. The plan covers the strategy, environments, CI/CD pipeline, and post-deployment procedures to ensure a smooth and reliable launch, adhering to the zero-cost infrastructure requirement.

## 2. Deployment Goals

- **Zero Downtime (or Minimal):** Aim for deployments that cause no or minimal interruption to users.
- **Reliability:** Ensure the deployed application is stable and functions as expected.
- **Automation:** Automate the build, test, and deployment process as much as possible.
- **Rollback Capability:** Have a clear plan to quickly revert to a previous stable version if issues arise.
- **Zero-Cost:** Utilize free-tier services for hosting and deployment.

## 3. Hosting Environment

- **Platform:** Vercel or Netlify (selected in T023 - Technology Stack Selection).
  - **Rationale:** Both offer generous free tiers, integrated CI/CD, global CDN, automatic SSL, and support for SvelteKit (including serverless functions).
- **Regions:** Handled by the CDN provider (Vercel/Netlify) for global distribution.

## 4. Deployment Environments

- **Development (Local):** Developer's local machine. `npm run dev` for SvelteKit.
- **Preview/Staging:** Automatically created by Vercel/Netlify for each pull request/branch.
  - Purpose: Testing new features, bug fixes, and UI changes in a production-like environment before merging to main.
  - URL: Unique URL provided by Vercel/Netlify (e.g., `project-name-git-branch-username.vercel.app`).
- **Production:** Live application accessible to end-users.
  - Trigger: Merging changes to the `main` (or `master`) branch.
  - URL: Custom domain (e.g., `aestheticpalettes.com` - to be acquired) and the default Vercel/Netlify URL (e.g., `project-name.vercel.app`).

## 5. CI/CD Pipeline (Continuous Integration/Continuous Deployment)

- **Version Control:** GitHub.
- **CI/CD Provider:** Vercel or Netlify (integrated with GitHub).

### 5.1. Pipeline Steps:

1.  **Code Commit:** Developer pushes code to a feature branch on GitHub.
2.  **Pull Request:** Developer creates a pull request to merge the feature branch into `main`.
3.  **Automated Build & Preview Deployment (Vercel/Netlify):**
    - Triggered by the pull request.
    - Vercel/Netlify pulls the code.
    - Installs dependencies (`npm install`).
    - Runs linters and formatters (e.g., ESLint, Prettier).
    - Runs automated tests (unit tests, integration tests - T053, T054).
    - Builds the SvelteKit application (`npm run build`).
    - Deploys the build to a unique preview URL.
    - Reports build status and test results back to the GitHub pull request.
4.  **Manual Review & Testing:**
    - Project Lead/QA reviews the changes on the preview URL.
    - Manual accessibility checks (T056).
    - User Acceptance Testing (UAT) if applicable (T057).
5.  **Merge to Main:** If all checks pass, the pull request is merged into the `main` branch.
6.  **Production Deployment (Vercel/Netlify):**
    - Triggered by the merge to `main`.
    - Vercel/Netlify pulls the latest code from `main`.
    - Repeats build and test steps (as in step 3).
    - If successful, deploys the new version to the production environment.
    - Atomic deployments: Vercel/Netlify typically ensure that the new version is fully deployed and ready before switching traffic, minimizing downtime.
7.  **Post-Deployment Verification:**
    - Smoke tests on the production environment.
    - Monitor application logs and performance.

## 6. Deployment Strategy

- **Blue/Green or Canary Deployments:** While advanced, Vercel/Netlify's infrastructure inherently supports instant rollbacks and atomic deployments, which provide similar benefits to blue/green by ensuring the old version remains active until the new one is fully ready. True canary releases might require more configuration or paid features.
- **Initial Deployment:** The first deployment will involve setting up the custom domain, DNS records, and ensuring all environment variables are correctly configured in Vercel/Netlify.

## 7. Environment Variables & Configuration

- Sensitive information (API keys, database connection strings) will be managed as environment variables within the Vercel/Netlify project settings.
- Different sets of environment variables for preview and production environments.
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - `TRANSACTIONAL_EMAIL_API_KEY`
  - Any AI service API keys.
- Configuration files (e.g., SvelteKit config) will be version-controlled.

## 8. Database Migrations (Supabase)

- Supabase supports schema migrations.
- Migrations will be developed locally and applied to the Supabase instance.
- For schema changes:
  1.  Develop migration scripts locally.
  2.  Test migrations in a development/staging Supabase project (if a separate free project is feasible, or carefully on the main one before production data).
  3.  Apply migrations to the production Supabase instance _before_ deploying application code that depends on the new schema.
  4.  Coordinate application deployment with database schema changes to avoid incompatibility.

## 9. Rollback Plan

- **Vercel/Netlify Feature:** Both platforms keep previous deployments and allow for instant rollback to a specific earlier deployment through their dashboards.
- **Procedure:**
  1.  Identify the problematic deployment.
  2.  Access the Vercel/Netlify dashboard.
  3.  Select the last known good deployment from the deployment history.
  4.  Promote the selected deployment to production.
  5.  Investigate the cause of the issue in the rolled-back version.
- **Database Rollback:** More complex. Requires restoring from a backup or applying counter-migration scripts. Supabase offers Point-in-Time Recovery (PITR) on paid plans; free tier backups are less frequent. Manual SQL scripts for reversing schema changes might be necessary for critical rollbacks.

## 10. Pre-Deployment Checklist

- All code reviewed and merged to `main`.
- All automated tests passing in CI.
- Successful build in CI.
- Manual testing on preview/staging environment completed and signed off.
- Accessibility checks passed.
- Environment variables for production are correctly configured.
- Database migrations (if any) have been applied and tested.
- User documentation (if impacted by changes) updated (T060).
- Communication to stakeholders (if significant changes).

## 11. Post-Deployment Checklist

- Verify application is accessible via production URL.
- Perform smoke tests on key functionalities.
- Monitor application logs for errors (Vercel/Netlify dashboards, Supabase logs).
- Check analytics for any unusual patterns.
- (If applicable) Announce updates to users.

## 12. Zero-Cost Considerations

- The entire CI/CD and hosting pipeline relies on the free tiers of GitHub and Vercel/Netlify.
- Supabase free tier for the database.
- Careful monitoring of build minutes, bandwidth, function invocations, and storage to stay within free limits.

This deployment plan provides a framework for reliably and efficiently deploying AestheticPalettes. It will be refined as the project progresses and specific tools are fully configured.
