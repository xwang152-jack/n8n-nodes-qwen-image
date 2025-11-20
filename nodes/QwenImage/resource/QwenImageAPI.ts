import {
  QwenImageConfig,
  ImageGenerationParams,
  ImageGenerationOptions,
  ImageGenerationResult,
  TaskSubmissionResponse,
  TaskStatusResponse
} from '../../help/type';

/**
 * 核心Qwen图像生成API类
 * 提供统一的图像生成接口，可被n8n节点和AI工具调用共享使用
 */
export class QwenImageAPI {
  private config: QwenImageConfig;

  constructor(config: QwenImageConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.apiKey || this.config.apiKey.trim() === '') {
      throw new Error('ModelScope Access Token is required');
    }
    if (!this.config.baseUrl || this.config.baseUrl.trim() === '') {
      throw new Error('Base URL is required');
    }
  }

  /**
   * 生成图像
   * @param params 图像生成参数
   * @param options 生成选项
   * @returns 图像生成结果
   */
  async generateImage(
    params: ImageGenerationParams,
    options: ImageGenerationOptions = {}
  ): Promise<ImageGenerationResult> {
    const { pollingInterval = 5, maxPollingTime = 300 } = options;

    // 提交任务
    const taskId = await this.submitTask(params);

    // 轮询结果
    const result = await this.pollTaskResult(taskId, pollingInterval, maxPollingTime);

    return result;
  }

  /**
   * 提交图像生成任务
   */
  private async submitTask(params: ImageGenerationParams): Promise<string> {
    const requestBody: any = {
      model: 'Qwen/Qwen-Image',
      prompt: params.prompt,
    };

    // 添加可选参数
    if (params.negativePrompt) {
      requestBody.negative_prompt = params.negativePrompt;
    }
    if (params.size) {
      requestBody.size = params.size;
    }
    if (params.seed && params.seed !== -1) {
      requestBody.seed = params.seed;
    }
    if (params.steps) {
      requestBody.steps = params.steps;
    }
    if (params.cfgScale) {
      requestBody.cfg_scale = params.cfgScale;
    }

    try {
      const response = await this.makeRequest('POST', 'v1/images/generations', {
        headers: {
          'X-ModelScope-Async-Mode': 'true',
        },
        body: requestBody,
      });

      if (response.task_id) {
        return response.task_id;
      } else {
        throw new Error(response.message || 'Failed to submit task');
      }
    } catch (error: any) {
      throw this.handleAPIError(error, 'Task submission failed');
    }
  }

  /**
   * 轮询任务结果
   */
  private async pollTaskResult(
    taskId: string,
    pollingInterval: number,
    maxPollingTime: number
  ): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const maxTime = maxPollingTime * 1000;

    while (Date.now() - startTime < maxTime) {
      try {
        const response = await this.makeRequest('GET', `v1/tasks/${taskId}`, {
          headers: {
            'X-ModelScope-Task-Type': 'image_generation',
          },
        });

        const taskStatus = response.task_status;

        if (taskStatus === 'SUCCEED') {
          const imageUrl = response.output_images[0];
          const imageData = await this.downloadImage(imageUrl);

          return {
            taskId,
            status: 'succeeded',
            imageUrl,
            imageData,
            metadata: {
              task_status: taskStatus,
              task_id: taskId,
            },
          };
        } else if (taskStatus === 'FAILED') {
          throw new Error(response.message || 'Image generation failed');
        } else if (taskStatus === 'RUNNING' || taskStatus === 'PENDING') {
          // 等待后继续轮询
          await this.sleep(pollingInterval * 1000);
          continue;
        }
      } catch (error: any) {
        if (error.message.includes('404')) {
          throw new Error(`Task ${taskId} not found. It may have expired or been deleted.`);
        }
        throw this.handleAPIError(error, 'Task polling failed');
      }
    }

    throw new Error(`Task did not complete within ${maxPollingTime} seconds`);
  }

  /**
   * 下载图像
   */
  private async downloadImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      throw new Error(`Image download failed: ${error.message}`);
    }
  }

  /**
   * 发送HTTP请求
   */
  private async makeRequest(
    method: 'GET' | 'POST',
    endpoint: string,
    options: {
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body && method === 'POST') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  /**
   * 处理API错误
   */
  private handleAPIError(error: any, context: string): Error {
    if (error.message.includes('401')) {
      return new Error('Authentication failed: Invalid API Key');
    } else if (error.message.includes('403')) {
      return new Error('Access forbidden: API Key does not have permission');
    } else if (error.message.includes('429')) {
      return new Error('Rate limit exceeded: Too many requests');
    } else {
      return new Error(`${context}: ${error.message}`);
    }
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
