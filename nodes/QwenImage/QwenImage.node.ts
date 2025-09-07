import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { IDataObject } from 'n8n-workflow';
import { QwenImageAPI } from './resource/QwenImageAPI';
import { ImageGenerationParams, ImageGenerationOptions } from '../help/type';

export class QwenImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qwen Image',
		name: 'qwenImage',
		icon: 'file:QwenImage.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate images using Qwen Image model from ModelScope',
		usableAsTool: true,
		defaults: {
			name: 'Qwen Image',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'modelScopeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Image',
						value: 'generate',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Text prompt for image generation',
				placeholder: 'e.g., A beautiful sunset over mountains',
			},
			{
				displayName: 'Negative Prompt',
				name: 'negativePrompt',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Negative prompt to avoid certain elements',
				placeholder: 'e.g., blurry, low quality',
			},
			{
				displayName: 'Image Size',
				name: 'size',
				type: 'options',
				default: '1024x1024',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				options: [
					{
						name: '1024x1024',
						value: '1024x1024',
					},
					{
						name: '720x1280',
						value: '720x1280',
					},
					{
						name: '1280x720',
						value: '1280x720',
					},
				],
				description: 'Size of the generated image',
			},
			{
				displayName: 'Polling Interval (Seconds)',
				name: 'pollingInterval',
				type: 'number',
				default: 5,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Interval between polling requests in seconds',
				typeOptions: {
					minValue: 1,
					maxValue: 60,
				},
			},
			{
				displayName: 'Max Polling Time (Seconds)',
				name: 'maxPollingTime',
				type: 'number',
				default: 300,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Maximum time to wait for task completion in seconds',
				typeOptions: {
					minValue: 60,
					maxValue: 1800,
				},
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				options: [
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'number',
						default: -1,
						description: 'Random seed for reproducible results',
					},
					{
						displayName: 'Steps',
						name: 'steps',
						type: 'number',
						default: 20,
						description: 'Number of denoising steps',
						typeOptions: {
							minValue: 1,
							maxValue: 50,
						},
					},
					{
						displayName: 'CFG Scale',
						name: 'cfgScale',
						type: 'number',
						default: 7,
						description: 'Classifier-free guidance scale',
						typeOptions: {
							minValue: 1,
							maxValue: 20,
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('modelScopeApi');
		const apiKey = credentials.apiKey as string;
		const baseUrl = credentials.baseUrl as string;

		// 创建API实例
		const qwenAPI = new QwenImageAPI({ apiKey, baseUrl });

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generate') {
					const prompt = this.getNodeParameter('prompt', i) as string;
					const negativePrompt = this.getNodeParameter('negativePrompt', i, '') as string;
					const size = this.getNodeParameter('size', i) as '1024x1024' | '720x1280' | '1280x720';
					const pollingInterval = this.getNodeParameter('pollingInterval', i, 5) as number;
					const maxPollingTime = this.getNodeParameter('maxPollingTime', i, 300) as number;
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as IDataObject;

					// 构建参数
					const params: ImageGenerationParams = {
						prompt,
						negativePrompt: negativePrompt || undefined,
						size,
						seed: additionalOptions.seed as number,
						steps: additionalOptions.steps as number,
						cfgScale: additionalOptions.cfgScale as number,
					};

					const options: ImageGenerationOptions = {
						pollingInterval,
						maxPollingTime,
					};

					// 调用核心API
					const result = await qwenAPI.generateImage(params, options);

					const jsonData: IDataObject = {
						taskId: result.taskId,
						status: result.status,
						imageUrl: result.imageUrl,
						prompt: prompt,
						negativePrompt: negativePrompt,
						size: size,
					};

					if (result.metadata && typeof result.metadata === 'object') {
						Object.assign(jsonData, result.metadata);
					}

					returnData.push({
						json: jsonData,
						binary: result.imageData
							? {
									data: {
										data: result.imageData.toString('base64'),
										mimeType: 'image/png',
										fileName: `qwen-image-${result.taskId}.png`,
									},
								}
							: undefined,
					});
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							status: 'failed',
						},
					});
				} else {
					// 将普通错误转换为NodeOperationError
					throw new NodeOperationError(this.getNode(), error.message);
				}
			}
		}

		return [returnData];
	}
}