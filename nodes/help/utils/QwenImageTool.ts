import { QwenImageAPI } from '../../QwenImage/resource/QwenImageAPI';
import {
  QwenImageConfig,
  ImageGenerationParams,
  ImageGenerationOptions,
  ImageGenerationResult,
  ToolFunction,
  ToolCallResult
} from '../type';

/**
 * Qwen图像生成工具类
 * 提供符合OpenAI Functions、LangChain等标准的AI工具调用接口
 */
export class QwenImageTool {
  private api: QwenImageAPI;
  private config: QwenImageConfig;

  constructor(config: QwenImageConfig) {
    this.config = config;
    this.api = new QwenImageAPI(config);
  }

  /**
   * 获取工具函数定义（OpenAI Functions格式）- 静态方法
   */
  static getToolFunction(): ToolFunction {
    return QwenImageTool._getToolFunctionDefinition();
  }

  /**
   * 获取工具函数定义（OpenAI Functions格式）- 实例方法
   */
  getToolFunction(): ToolFunction {
    return QwenImageTool._getToolFunctionDefinition();
  }

  /**
   * 内部方法：获取工具函数定义
   */
  private static _getToolFunctionDefinition(): ToolFunction {
    return {
      name: 'generate_qwen_image',
      description: 'Generate images using Qwen Image model from ModelScope. This tool can create high-quality images based on text prompts.',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'Text prompt for image generation. Be descriptive and specific about what you want to see in the image.',
            minLength: 1,
            maxLength: 1000
          },
          negative_prompt: {
            type: 'string',
            description: 'Negative prompt to avoid certain elements in the generated image (optional)',
            maxLength: 500
          },
          size: {
            type: 'string',
            enum: ['1024x1024', '720x1280', '1280x720'],
            description: 'Size of the generated image',
            default: '1024x1024'
          },
          seed: {
            type: 'integer',
            description: 'Random seed for reproducible results. Use -1 for random seed.',
            minimum: -1,
            maximum: 2147483647,
            default: -1
          },
          steps: {
            type: 'integer',
            description: 'Number of denoising steps. Higher values may produce better quality but take longer.',
            minimum: 1,
            maximum: 50,
            default: 20
          },
          cfg_scale: {
            type: 'number',
            description: 'Classifier-free guidance scale. Higher values follow the prompt more closely.',
            minimum: 1,
            maximum: 20,
            default: 7
          },
          polling_interval: {
            type: 'integer',
            description: 'Interval between polling requests in seconds',
            minimum: 1,
            maximum: 60,
            default: 5
          },
          max_polling_time: {
            type: 'integer',
            description: 'Maximum time to wait for task completion in seconds',
            minimum: 60,
            maximum: 1800,
            default: 300
          }
        },
        required: ['prompt']
      }
    };
  }

  /**
   * 执行工具调用
   * @param args 工具调用参数
   * @returns 工具调用结果
   */
  async call(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      // 验证必需参数
      if (!args.prompt || typeof args.prompt !== 'string') {
        return {
          success: false,
          error: 'Missing or invalid prompt parameter'
        };
      }

      // 构建图像生成参数
      const params: ImageGenerationParams = {
        prompt: args.prompt,
        negativePrompt: args.negative_prompt || undefined,
        size: args.size || '1024x1024',
        seed: args.seed !== undefined ? args.seed : -1,
        steps: args.steps || 20,
        cfgScale: args.cfg_scale || 7,
      };

      // 构建选项
      const options: ImageGenerationOptions = {
        pollingInterval: args.polling_interval || 5,
        maxPollingTime: args.max_polling_time || 300,
      };

      // 调用API生成图像
      const result = await this.api.generateImage(params, options);

      return {
        success: true,
        data: {
          task_id: result.taskId,
          status: result.status,
          image_url: result.imageUrl,
          prompt: params.prompt,
          negative_prompt: params.negativePrompt,
          size: params.size,
          seed: params.seed,
          steps: params.steps,
          cfg_scale: params.cfgScale,
          metadata: result.metadata,
          // 注意：imageData (Buffer) 不包含在工具调用结果中，因为它太大
          // 如果需要图像数据，应该通过image_url下载
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred during image generation'
      };
    }
  }

  /**
   * 获取工具元数据
   */
  static getMetadata() {
    return {
      name: 'qwen-image-generator',
      version: '2.0.0',
      description: 'AI tool for generating images using Qwen Image model',
      author: 'xwang152-jack',
      tags: ['image-generation', 'ai', 'qwen', 'modelscope'],
      capabilities: [
        'text-to-image',
        'negative-prompting',
        'size-control',
        'seed-control',
        'step-control',
        'cfg-scale-control'
      ],
      supported_formats: ['png'],
      supported_sizes: ['1024x1024', '720x1280', '1280x720'],
      max_prompt_length: 1000,
      max_negative_prompt_length: 500,
      typical_generation_time: '30-120 seconds',
      rate_limits: 'Depends on ModelScope API limits'
    };
  }
}

/**
 * 工厂函数：创建Qwen图像生成工具实例
 * @param config API配置
 * @returns QwenImageTool实例
 */
export function createQwenImageTool(config: QwenImageConfig): QwenImageTool {
  return new QwenImageTool(config);
}

/**
 * 便捷函数：直接调用图像生成
 * @param config API配置
 * @param prompt 图像提示词
 * @param options 可选参数
 * @returns 工具调用结果
 */
export async function generateImage(
  config: QwenImageConfig,
  prompt: string,
  options: Partial<ImageGenerationParams & ImageGenerationOptions> = {}
): Promise<ToolCallResult> {
  const tool = new QwenImageTool(config);
  return tool.call({
    prompt,
    ...options
  });
}

// 导出工具函数定义，供外部使用
export const QWEN_IMAGE_TOOL_FUNCTION = QwenImageTool.getToolFunction();
export const QWEN_IMAGE_TOOL_METADATA = QwenImageTool.getMetadata();