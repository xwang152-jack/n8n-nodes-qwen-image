# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-09-07

### 🚀 Major Changes
- **BREAKING**: Complete architecture redesign for dual-purpose functionality
- **NEW**: AI tool calling interface supporting OpenAI Functions, LangChain, and other AI frameworks
- **NEW**: Modular architecture with separated core API, n8n node, and AI tool interfaces
- **NEW**: Enhanced TypeScript support with proper type definitions
- **NEW**: Modern package structure with multiple export paths

### ✨ Added
- `QwenImageTool` class for AI tool calling
- `createQwenImageTool()` factory function
- `generateImage()` convenience function
- `QWEN_IMAGE_TOOL_FUNCTION` constant for OpenAI Functions integration
- `QWEN_IMAGE_TOOL_METADATA` constant with tool information
- Comprehensive AI framework integration examples
- Enhanced error handling with structured responses
- Support for both CommonJS and ES modules
- Multiple export paths for different use cases

### 🔧 Changed
- **BREAKING**: Project structure reorganized under `src/` directory
- **BREAKING**: Main entry point changed to `dist/index.js`
- **BREAKING**: n8n node path updated to `dist/n8n/QwenImage.node.js`
- Enhanced package.json with dual-purpose exports
- Updated TypeScript configuration for new structure
- Improved documentation with dual-usage examples
- Version bumped to 2.0.0 to reflect major changes

### 🛡️ Improved
- Better error handling and validation
- Enhanced type safety with comprehensive interfaces
- More robust API client implementation
- Improved polling mechanism with better timeout handling
- Enhanced parameter validation

### 📚 Documentation
- Complete README rewrite with dual-usage examples
- Added OpenAI Functions integration guide
- Added LangChain integration examples
- Enhanced API reference documentation
- Added troubleshooting section for both use cases
- Comprehensive parameter documentation table

### 🔄 Migration Guide
- Existing n8n workflows continue to work without changes
- New AI tool functionality requires updating import statements
- See README for detailed migration and usage examples

## [1.0.0] - 2025-09-07

### Added
- Initial release of n8n-nodes-qwen-image
- Support for Qwen Image generation using ModelScope API
- Configurable image sizes (1024x1024, 720x1280, 1280x720)
- Advanced parameters control (seed, steps, CFG scale)
- Automatic task polling with configurable intervals
- Built-in error handling and retry mechanisms
- Comprehensive documentation and examples

### Features
- Text-to-image generation with positive and negative prompts
- Multiple image size options
- Reproducible results with seed control
- Quality control through steps and CFG scale parameters
- Robust polling mechanism for task completion
- Base64 encoded image data output
- Detailed metadata in response

### Technical
- TypeScript implementation
- n8n community node standards compliance
- ModelScope API integration
- Comprehensive error handling
- Input validation and sanitization

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