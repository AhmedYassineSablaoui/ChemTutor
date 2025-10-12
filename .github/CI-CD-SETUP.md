# ChemTutor CI/CD Pipeline Documentation

## Overview

This repository includes a comprehensive CI/CD pipeline using GitHub Actions that automates testing, security scanning, code quality checks, and deployment to GitHub Pages.

## Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Backend Tests & Linting
- **Python 3.12** setup with dependency caching
- Django migrations check
- Backend test suite execution
- Flake8 linting with custom configuration
- Coverage reporting

#### Frontend Tests & Linting
- **Node.js 18** setup with npm caching
- Frontend test suite execution with Jest
- ESLint code quality checks
- Frontend build verification
- Build artifact upload

#### Security Scan
- **Trivy** vulnerability scanner
- Filesystem security analysis
- SARIF report upload to GitHub Security tab

#### Code Quality
- **SonarCloud** integration (requires `SONAR_TOKEN` secret)
- Code quality metrics and analysis

#### Deploy to GitHub Pages
- **Automatic deployment** on pushes to `main` branch
- Frontend build and deployment to GitHub Pages
- Environment protection with `github-pages` environment

#### Notification
- Success/failure notifications
- Deployment status reporting

### 2. Dependency Updates (`.github/workflows/dependency-update.yml`)

**Triggers:**
- Weekly schedule (Mondays at 9 AM UTC)
- Manual workflow dispatch

**Features:**
- Automated Python dependency updates
- Automated Node.js dependency updates
- Automatic pull request creation for updates
- Security audit fixes

### 3. Release Management (`.github/workflows/release.yml`)

**Triggers:**
- Git tags (e.g., `v1.0.0`)
- Manual workflow dispatch

**Features:**
- Automatic release creation
- Frontend build inclusion
- Changelog generation
- Release asset upload

### 4. Database Backup (`.github/workflows/backup.yml`)

**Triggers:**
- Daily schedule (2 AM UTC)
- Manual workflow dispatch

**Features:**
- Django database backup
- JSON export with natural keys
- 30-day artifact retention
- Backup completion notifications

## Configuration Files

### Backend Configuration

#### `backend/requirements-dev.txt`
Development dependencies including:
- Testing tools (pytest, pytest-django, pytest-cov)
- Linting tools (flake8, black, isort, mypy)
- Security tools (bandit, safety)
- Documentation tools (sphinx)

#### `backend/.flake8`
Flake8 configuration with:
- 127 character line length limit
- Complexity threshold of 10
- Custom ignore patterns
- Per-file ignore rules

#### `backend/pytest.ini`
Pytest configuration with:
- Django settings integration
- Coverage reporting (80% threshold)
- HTML coverage reports
- Test markers for categorization

### Frontend Configuration

#### `frontend/.eslintrc.js`
ESLint configuration with:
- React and TypeScript support
- Accessibility rules (jsx-a11y)
- Custom rule overrides
- Proper file ignore patterns

#### `frontend/jest.config.js`
Jest configuration with:
- jsdom test environment
- Coverage thresholds (70% global)
- Module name mapping
- Custom test patterns

## Required Secrets

To fully utilize the CI/CD pipeline, add these secrets to your GitHub repository:

### Required Secrets
- `GITHUB_TOKEN` (automatically provided)

### Optional Secrets
- `SONAR_TOKEN`: For SonarCloud integration
- `DEPLOY_TOKEN`: For additional deployment options

## Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Set source to "GitHub Actions"
4. The deployment will be handled automatically

### 2. Configure SonarCloud (Optional)
1. Sign up at [SonarCloud](https://sonarcloud.io)
2. Create a new project for your repository
3. Get the project key and organization
4. Add `SONAR_TOKEN` secret to your repository

### 3. Repository Settings
1. Enable "Allow GitHub Actions to create and approve pull requests"
2. Set up branch protection rules for `main` branch
3. Require status checks to pass before merging

## Workflow Features

### Automated Testing
- **Backend**: Django tests with coverage reporting
- **Frontend**: React tests with Jest and coverage
- **Security**: Vulnerability scanning with Trivy
- **Quality**: Code linting and quality checks

### Automated Deployment
- **GitHub Pages**: Automatic deployment on main branch pushes
- **Build Artifacts**: Frontend build artifacts for releases
- **Environment Protection**: GitHub Pages environment with approval

### Monitoring & Maintenance
- **Dependency Updates**: Weekly automated updates
- **Database Backups**: Daily automated backups
- **Release Management**: Tag-based releases with assets

## Best Practices

### Development Workflow
1. Create feature branches from `develop`
2. Make changes and commit
3. Push to GitHub (triggers CI)
4. Create pull request to `develop`
5. After review, merge to `develop`
6. Periodically merge `develop` to `main` for deployment

### Code Quality
- Maintain test coverage above 80% (backend) and 70% (frontend)
- Fix all linting errors before merging
- Address security vulnerabilities promptly
- Use conventional commit messages

### Release Process
1. Update version numbers
2. Create and push a git tag (e.g., `v1.0.0`)
3. Monitor the release workflow
4. Verify deployment on GitHub Pages

## Troubleshooting

### Common Issues

#### Build Failures
- Check test coverage thresholds
- Verify all dependencies are properly listed
- Ensure linting rules are satisfied

#### Deployment Issues
- Verify GitHub Pages is enabled
- Check repository permissions
- Ensure build artifacts are generated

#### Security Scan Failures
- Review Trivy scan results
- Update vulnerable dependencies
- Consider security policy exceptions

### Getting Help
- Check workflow logs in GitHub Actions tab
- Review individual job outputs
- Consult GitHub Actions documentation
- Check repository settings and permissions

## Customization

### Adding New Tests
1. Add test files to appropriate directories
2. Update coverage thresholds if needed
3. Add new test markers for categorization

### Modifying Deployment
1. Update deployment steps in `ci-cd.yml`
2. Configure additional environments
3. Add deployment approvals if needed

### Extending Security
1. Add additional security tools
2. Configure custom security policies
3. Set up security notifications

## Monitoring

### Workflow Status
- Monitor workflow runs in GitHub Actions tab
- Set up notifications for failures
- Review security alerts regularly

### Performance Metrics
- Track build times and optimize
- Monitor test coverage trends
- Review deployment frequency

### Maintenance
- Regularly review and update dependencies
- Clean up old artifacts and backups
- Update workflow configurations as needed
