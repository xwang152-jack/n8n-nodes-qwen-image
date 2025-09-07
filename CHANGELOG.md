# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-01-07

### Fixed
- Fixed ESLint violations by removing setTimeout usage to comply with n8n community package requirements
- Removed restricted global variables (setTimeout, setImmediate) from codebase
- Improved polling mechanism for better compatibility with n8n security standards

### Changed
- Optimized polling logic for task status checking
- Enhanced code quality and security compliance
- Updated package dependencies

### Technical
- Replaced setTimeout with synchronous polling approach
- Removed sleep function that used restricted global variables
- Ensured full compliance with n8n community node guidelines

## [0.1.0] - 2025-01-07

### Added
- Initial release of n8n-nodes-qwen-image
- Support for Qwen Image generation via ModelScope API
- Complete integration with n8n workflow automation
- Image generation with configurable parameters:
  - Multiple image sizes (1024x1024, 720x1280, 1280x720)
  - Configurable seed, steps, and CFG scale parameters
  - Support for negative prompts
  - Automatic task status polling with configurable intervals
- Comprehensive error handling and user-friendly messages
- Secure API key management through n8n credentials
- TypeScript implementation for type safety
- ESLint configuration for code quality
- Automated build and packaging system

### Documentation
- Complete README with installation and usage instructions
- API reference and examples
- ModelScope integration guide
- Troubleshooting section
- Contributing guidelines

### Technical Details
- Built with TypeScript
- Follows n8n community node development standards
- Full compatibility with n8n workflow engine
- Requires n8n version 0.174.0 or higher
- Node.js 16+ support for development

---

## Release Notes Format

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
- **Technical** for internal technical improvements

### Version Numbering
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes