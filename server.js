const express = require('express');
const cors = require('cors');
const { QwenImageAPI } = require('./dist/core/QwenImageAPI');

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'QwenImage API Server' });
});

// 获取工具元数据端点
app.get('/api/qwen-image/metadata', (req, res) => {
  const metadata = {
    name: 'QwenImage',
    description: 'Generate high-quality images using Qwen AI model from ModelScope',
    version: '2.0.0',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The text prompt describing the image to generate',
          required: true
        },
        negative_prompt: {
          type: 'string',
          description: 'Negative prompt to avoid certain elements in the image',
          required: false
        },
        size: {
          type: 'string',
          description: 'Image size in format "width*height"',
          enum: ['1024*1024', '720*1280', '1280*720'],
          default: '1024*1024'
        },
        seed: {
          type: 'integer',
          description: 'Random seed for reproducible results',
          minimum: -1,
          maximum: 4294967295,
          default: -1
        },
        steps: {
          type: 'integer',
          description: 'Number of inference steps',
          minimum: 1,
          maximum: 50,
          default: 20
        },
        cfg_scale: {
          type: 'number',
          description: 'Classifier-free guidance scale',
          minimum: 1.0,
          maximum: 20.0,
          default: 7.0
        }
      },
      required: ['prompt']
    }
  };
  
  res.json(metadata);
});

// 图像生成端点
app.post('/api/qwen-image/generate', async (req, res) => {
  try {
    const { apiKey, baseUrl, ...params } = req.body;
    
    // 验证必需参数
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      });
    }
    
    if (!params.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    // 创建API实例
    const qwenAPI = new QwenImageAPI({
      apiKey,
      baseUrl: baseUrl || 'https://dashscope.aliyuncs.com/api/v1'
    });
    
    // 生成图像
    const result = await qwenAPI.generateImage(params);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`QwenImage API Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Metadata: http://localhost:${port}/api/qwen-image/metadata`);
  console.log(`Generate: POST http://localhost:${port}/api/qwen-image/generate`);
});

module.exports = app;