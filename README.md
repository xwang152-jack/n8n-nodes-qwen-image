# n8n-nodes-qwen-image

This is an n8n community node. It lets you use Qwen Image in your n8n workflows.

Qwen Image is a powerful AI image generation model that creates high-quality images from text descriptions using ModelScope API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Generate Image
Create images from text prompts using Qwen Image model with support for various parameters including image size, negative prompts, and advanced generation settings.

## Credentials

To use this node, you need to authenticate with the ModelScope API:

1. Sign up for an account at [ModelScope](https://www.modelscope.cn/)
2. Obtain your API key from the dashboard
3. In n8n, create a new credential of type "ModelScope API"
4. Enter your API key in the credential configuration

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested n8n versions**: 1.32.2+
- **Node.js**: >= 20.15

## Usage

### Basic Image Generation
1. Add the "Qwen Image" node to your workflow
2. Configure the credential with your API key
3. Set the required prompt parameter
4. Optionally configure image size, negative prompts, and advanced options
5. Execute the workflow to generate images

### Example Parameters
- **Prompt**: "A beautiful sunset over mountains with vibrant colors"
- **Image Size**: 1024x1024
- **Steps**: 20 (default)
- **CFG Scale**: 7 (default)

For users new to n8n, check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation to get started with basic workflow creation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [ModelScope API Documentation](https://www.modelscope.cn/docs/)
* [ModelScope Inference API](https://api-inference.modelscope.cn/)
