# n8n-nodes-qwen-image

[![npm version](https://badge.fury.io/js/n8n-nodes-qwen-image.svg)](https://badge.fury.io/js/n8n-nodes-qwen-image)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an n8n community node that integrates Qwen Image generation capabilities into your n8n workflows.

🎨 **Qwen Image** is a state-of-the-art AI image generation model developed by Alibaba Cloud, capable of creating high-quality, photorealistic images from text descriptions using the ModelScope API.

🔄 **[n8n](https://n8n.io/)** is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform that allows you to connect different services and automate tasks.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Operations](#operations)
- [Credentials](#credentials)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [Resources](#resources)  

## 🚀 Installation

### Method 1: Via n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter the package name: `n8n-nodes-qwen-image`
5. Click **Install**
6. Restart your n8n instance

### Method 2: Via npm (Self-hosted)

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the community node
npm install n8n-nodes-qwen-image

# Restart n8n
n8n start
```

### Method 3: Docker

If you're using n8n with Docker, add the package to your Dockerfile:

```dockerfile
FROM n8nio/n8n
USER root
RUN npm install -g n8n-nodes-qwen-image
USER node
```

For more detailed installation instructions, follow the [official n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## ⚡ Quick Start

1. **Install the node** using one of the methods above
2. **Get your ModelScope API key** from [ModelScope Console](https://www.modelscope.cn/)
3. **Create credentials** in n8n (Settings → Credentials → Add Credential → ModelScope API)
4. **Add the Qwen Image node** to your workflow
5. **Configure and execute** your first image generation!

## 🛠️ Operations

### Generate Image

The primary operation allows you to create stunning images from text descriptions with extensive customization options:

#### Core Parameters
- **Prompt** (required): Detailed text description of the image you want to generate
- **Image Size**: Choose from multiple aspect ratios:
  - `1024x1024` - Square format (default)
  - `720x1280` - Portrait format
  - `1280x720` - Landscape format

#### Advanced Parameters
- **Negative Prompt**: Specify what you don't want in the image
- **Seed**: Set a specific seed for reproducible results (optional)
- **Steps**: Number of inference steps (1-50, default: 20)
- **CFG Scale**: Classifier-free guidance scale (1-20, default: 7)
- **Poll Interval**: How often to check task status in seconds (default: 5)
- **Max Poll Attempts**: Maximum polling attempts before timeout (default: 60)

## 🔐 Credentials

### Setting up ModelScope API Credentials

#### Step 1: Get Your API Key
1. Visit [ModelScope](https://www.modelscope.cn/) and create an account
2. Navigate to your [API Keys page](https://www.modelscope.cn/my/myaccesstoken)
3. Generate a new API key or copy your existing one

#### Step 2: Configure in n8n
1. In your n8n instance, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for and select **"ModelScope API"**
4. Enter your API key in the **API Key** field
5. Test the connection and save

#### Security Notes
- Keep your API key secure and never share it publicly
- Use environment variables for production deployments
- Regularly rotate your API keys for enhanced security

## ⚙️ Configuration

### Environment Variables (Optional)

For production deployments, you can set environment variables:

```bash
# ModelScope API Configuration
MODELSCOPE_API_KEY=your_api_key_here
MODELSCOPE_API_URL=https://api-inference.modelscope.cn
```

## 🔄 Compatibility

| Component | Version Requirement |
|-----------|--------------------|
| **n8n** | >= 1.0.0 |
| **Node.js** | >= 18.0.0 |
| **npm** | >= 8.0.0 |

### Tested Versions
- ✅ n8n 1.32.2+
- ✅ Node.js 18.x, 20.x, 22.x
- ✅ npm 8.x, 9.x, 10.x

### Platform Support
- ✅ Linux (Ubuntu, CentOS, Alpine)
- ✅ macOS (Intel & Apple Silicon)
- ✅ Windows 10/11
- ✅ Docker containers

## 📖 Usage Examples

### Example 1: Basic Image Generation

```json
{
  "prompt": "A majestic dragon flying over a medieval castle at sunset, fantasy art style",
  "imageSize": "1024x1024",
  "steps": 20,
  "cfgScale": 7
}
```

### Example 2: Advanced Configuration with Negative Prompts

```json
{
  "prompt": "Professional headshot of a business person, clean background, high quality",
  "negativePrompt": "blurry, low quality, distorted, cartoon, anime",
  "imageSize": "720x1280",
  "seed": 12345,
  "steps": 30,
  "cfgScale": 8
}
```

### Example 3: Batch Image Generation Workflow

1. **HTTP Request Node**: Fetch prompts from an API
2. **Code Node**: Process and format the prompts
3. **Qwen Image Node**: Generate images for each prompt
4. **Google Drive Node**: Save generated images to cloud storage

### Example 4: Content Creation Pipeline

1. **Webhook Node**: Receive content requests
2. **OpenAI Node**: Generate image descriptions
3. **Qwen Image Node**: Create images from descriptions
4. **Slack Node**: Send results to team channel

### Pro Tips

- **Detailed Prompts**: More specific prompts yield better results
- **Negative Prompts**: Use to avoid unwanted elements
- **Seed Values**: Use the same seed for consistent results
- **Aspect Ratios**: Choose based on your intended use case

## 🔧 Troubleshooting

### Common Issues

#### "Authentication Failed"
- ✅ Verify your ModelScope API key is correct
- ✅ Check if your API key has sufficient permissions
- ✅ Ensure the credential is properly configured in n8n

#### "Task Timeout"
- ✅ Increase the `maxPollAttempts` parameter
- ✅ Check ModelScope service status
- ✅ Try with a simpler prompt

#### "Invalid Image Size"
- ✅ Use only supported sizes: `1024x1024`, `720x1280`, `1280x720`
- ✅ Check for typos in the imageSize parameter

#### "Rate Limit Exceeded"
- ✅ Implement delays between requests
- ✅ Check your ModelScope API quota
- ✅ Consider upgrading your ModelScope plan

### Debug Mode

Enable debug logging in n8n to see detailed request/response information:

```bash
N8N_LOG_LEVEL=debug n8n start
```

### Getting Help

- 📖 Check the [ModelScope API Documentation](https://www.modelscope.cn/docs/)
- 💬 Join the [n8n Community](https://community.n8n.io/)
- 🐛 Report issues on [GitHub](https://github.com/your-username/n8n-nodes-qwen-image/issues)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/n8n-nodes-qwen-image.git
cd n8n-nodes-qwen-image

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use ESLint configuration provided
- Write clear commit messages
- Update documentation for new features

### Reporting Issues

When reporting issues, please include:
- n8n version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs

## 📚 Resources

### Official Documentation
- 📖 [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- 🔧 [ModelScope API Documentation](https://www.modelscope.cn/docs/)
- 🚀 [ModelScope Inference API](https://api-inference.modelscope.cn/)
- 💡 [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)

### Community & Support
- 💬 [n8n Community Forum](https://community.n8n.io/)
- 💭 [n8n Discord Server](https://discord.gg/n8n)
- 🐛 [Report Issues](https://github.com/your-username/n8n-nodes-qwen-image/issues)
- 📧 [Contact Support](mailto:support@example.com)

### Related Projects
- 🎨 [Qwen Image Model](https://www.modelscope.cn/models/qwen/Qwen-VL)
- 🤖 [Other n8n AI Nodes](https://www.npmjs.com/search?q=n8n-nodes-ai)
- 🔗 [ModelScope Community](https://www.modelscope.cn/community)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the [n8n team](https://n8n.io/) for creating an amazing automation platform
- Thanks to [Alibaba Cloud](https://www.alibabacloud.com/) for the Qwen Image model
- Thanks to the [ModelScope](https://www.modelscope.cn/) team for providing the API
- Thanks to all contributors who help improve this project

---

<div align="center">
  <strong>Made with ❤️ for the n8n community</strong>
</div>
