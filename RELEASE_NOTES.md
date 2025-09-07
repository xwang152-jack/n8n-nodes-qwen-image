# Release Notes

## v0.1.1 (2025-01-07)

### 🐛 Bug Fixes
- Fixed ESLint violations by removing setTimeout usage to comply with n8n community package requirements
- Improved polling mechanism for better compatibility with n8n security standards

### 📦 Package Updates
- Updated package version to 0.1.1
- Ensured full compliance with n8n community node guidelines

### 🔧 Technical Improvements
- Removed restricted global variables (setTimeout, setImmediate) from codebase
- Optimized polling logic for task status checking
- Enhanced code quality and security compliance

---

## v0.1.0 (2025-01-07)

### 🎉 Initial Release
- First stable release of n8n-nodes-qwen-image
- Support for Qwen Image generation via ModelScope API
- Complete integration with n8n workflow automation

### ✨ Features
- **Image Generation**: Generate high-quality images using Qwen Image model
- **Flexible Configuration**: Support for various image sizes (1024x1024, 720x1280, 1280x720)
- **Advanced Options**: Configurable seed, steps, and CFG scale parameters
- **Negative Prompts**: Support for negative prompts to avoid unwanted elements
- **Polling System**: Automatic task status polling with configurable intervals
- **Error Handling**: Comprehensive error handling and user-friendly messages
- **Credentials Management**: Secure API key management through n8n credentials

### 🔧 Technical Details
- Built with TypeScript for type safety
- Follows n8n community node development standards
- Comprehensive ESLint configuration for code quality
- Automated build and packaging system
- Full compatibility with n8n workflow engine

### 📋 Requirements
- n8n version 0.174.0 or higher
- ModelScope API credentials
- Node.js 16+ for development

### 🚀 Installation
```bash
npm install n8n-nodes-qwen-image
```

### 📖 Documentation
- Complete setup and usage instructions in README.md
- API reference and examples included
- ModelScope integration guide provided