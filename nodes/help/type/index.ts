// 共享类型定义
export interface QwenImageConfig {
  apiKey: string;
  baseUrl: string;
}

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  size?: '1024x1024' | '720x1280' | '1280x720';
  seed?: number;
  steps?: number;
  cfgScale?: number;
}

export interface ImageGenerationOptions {
  pollingInterval?: number;
  maxPollingTime?: number;
}

export interface ImageGenerationResult {
  taskId: string;
  status: 'succeeded' | 'failed' | 'pending' | 'running';
  imageUrl?: string;
  imageData?: Buffer;
  metadata?: Record<string, any>;
}

export interface TaskSubmissionResponse {
  task_id: string;
  message?: string;
}

export interface TaskStatusResponse {
  task_status: 'SUCCEED' | 'FAILED' | 'RUNNING' | 'PENDING';
  output_images?: string[];
  message?: string;
}

// AI工具调用相关类型
export interface ToolFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ToolCallResult {
  success: boolean;
  data?: any;
  error?: string;
}