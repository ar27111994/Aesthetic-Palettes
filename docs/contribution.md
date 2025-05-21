# Contribution Guidelines

## Appendix E: Version Control Practices

### Branching Strategy

- Follow patterns from [Developer Setup Guide](dev-setup.md)
- Protect main branch with required status checks
- Use PR templates for code reviews
- Automatic branch cleanup after merge

### Commit Message Standards

- Prefix with type: feat|fix|docs|style|refactor|test|chore
- Include GitHub issue reference if applicable
- Follow [Conventional Commits](https://www.conventionalcommits.org) specification
- Body text must reference impacted components

### Code Review Process

1. Require 2 approvals from core maintainers
2. All CI/CD checks must pass
3. Squash merge with semantic message
4. Delete feature branches after merge
5. Link to corresponding GitHub issue

### Security Practices

- Signed commits required for production releases
- Dependency scanning via CI/CD pipeline
- Secret scanning enabled in repository

### Related Workflows

- [CI/CD Pipeline Configuration](/.github/workflows/ci-cd.yml)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Repository](https://github.com/ar27111994/Aesthetic-Palettes)
