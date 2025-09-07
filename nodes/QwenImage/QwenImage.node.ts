import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { IDataObject } from 'n8n-workflow';

// Helper function for delay
const sleep = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(() => resolve(), ms);
	});

export class QwenImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qwen Image',
		name: 'qwenImage',
		icon: 'file:QwenImage.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate images using Qwen Image model from ModelScope',
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

		// Validate credentials
		if (!apiKey || apiKey.trim() === '') {
			throw new NodeOperationError(this.getNode(), 'API Key is required', {
				description: 'Please configure your ModelScope API Key in the credentials',
			});
		}

		if (!baseUrl || baseUrl.trim() === '') {
			throw new NodeOperationError(this.getNode(), 'Base URL is required', {
				description: 'Please configure your ModelScope API Base URL in the credentials',
			});
		}

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generate') {
					const prompt = this.getNodeParameter('prompt', i) as string;
					const negativePrompt = this.getNodeParameter('negativePrompt', i, '') as string;
					const size = this.getNodeParameter('size', i) as string;
					const pollingInterval = this.getNodeParameter('pollingInterval', i, 5) as number;
					const maxPollingTime = this.getNodeParameter('maxPollingTime', i, 300) as number;
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as IDataObject;

					// Submit task
					const taskId = await QwenImage.submitTask(
						this,
						apiKey,
						baseUrl,
						prompt,
						negativePrompt,
						size,
						additionalOptions,
					);

					// Poll for result
					const result = await QwenImage.pollTaskResult(
						this,
						apiKey,
						baseUrl,
						taskId,
						pollingInterval,
						maxPollingTime,
					);

					const jsonData: IDataObject = {
						taskId: taskId,
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
										data: (result.imageData as Buffer).toString('base64'),
										mimeType: 'image/png',
										fileName: `qwen-image-${taskId}.png`,
									},
								}
							: undefined,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							status: 'failed',
						},
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}

	private static async submitTask(
		context: IExecuteFunctions,
		apiKey: string,
		baseUrl: string,
		prompt: string,
		negativePrompt?: string,
		size?: string,
		additionalOptions?: IDataObject,
	): Promise<string> {
		const requestBody: any = {
			model: 'Qwen/Qwen-Image',
			prompt: prompt,
		};

		// Add optional parameters if provided
		if (negativePrompt) {
			requestBody.negative_prompt = negativePrompt;
		}
		if (size) {
			requestBody.size = size;
		}
		if (additionalOptions?.seed && additionalOptions.seed !== -1) {
			requestBody.seed = additionalOptions.seed;
		}
		if (additionalOptions?.steps) {
			requestBody.steps = additionalOptions.steps;
		}
		if (additionalOptions?.cfgScale) {
			requestBody.cfg_scale = additionalOptions.cfgScale;
		}

		let response;
		try {
			response = await context.helpers.request({
				method: 'POST',
				uri: `${baseUrl}v1/images/generations`,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					'X-ModelScope-Async-Mode': 'true',
				},
				body: requestBody,
				json: true,
			});
		} catch (error: any) {
			if (error.response?.status === 401) {
				throw new NodeOperationError(context.getNode(), 'Authentication failed', {
					description: 'Invalid API Key. Please check your ModelScope API credentials.',
				});
			} else if (error.response?.status === 403) {
				throw new NodeOperationError(context.getNode(), 'Access forbidden', {
					description: 'Your API Key does not have permission to access this resource.',
				});
			} else if (error.response?.status === 429) {
				throw new NodeOperationError(context.getNode(), 'Rate limit exceeded', {
					description: 'Too many requests. Please wait and try again later.',
				});
			} else {
				throw new NodeOperationError(context.getNode(), 'API request failed', {
					description: error.message || 'Unknown error occurred during API request',
				});
			}
		}

		if (response.task_id) {
			return response.task_id;
		} else {
			throw new NodeOperationError(context.getNode(), 'Failed to submit task', {
				description: response.message || 'Unknown error during task submission',
			});
		}
	}

	private static async pollTaskResult(
		context: IExecuteFunctions,
		apiKey: string,
		baseUrl: string,
		taskId: string,
		pollingInterval: number,
		maxPollingTime: number,
	): Promise<IDataObject> {
		const startTime = Date.now();
		const maxTime = maxPollingTime * 1000;

		while (Date.now() - startTime < maxTime) {
			let response;
		try {
			response = await context.helpers.request({
				method: 'GET',
				uri: `${baseUrl}v1/tasks/${taskId}`,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'X-ModelScope-Task-Type': 'image_generation',
				},
				json: true,
			});
		} catch (error: any) {
			if (error.response?.status === 401) {
				throw new NodeOperationError(context.getNode(), 'Authentication failed during polling', {
					description: 'Invalid API Key. Please check your ModelScope API credentials.',
				});
			} else if (error.response?.status === 404) {
				throw new NodeOperationError(context.getNode(), 'Task not found', {
					description: `Task ${taskId} not found. It may have expired or been deleted.`,
				});
			} else {
				throw new NodeOperationError(context.getNode(), 'Polling request failed', {
					description: error.message || 'Unknown error occurred during task polling',
				});
			}
		}

			const taskStatus = response.task_status;

			if (taskStatus === 'SUCCEED') {
				const imageUrl = response.output_images[0];
				const imageData = await context.helpers.request({
					method: 'GET',
					uri: imageUrl,
					encoding: null,
				});

				return {
					status: 'succeeded',
					imageUrl: imageUrl,
					imageData: imageData,
					metadata: {
						task_status: taskStatus,
						task_id: taskId,
					},
				};
			} else if (taskStatus === 'FAILED') {
				throw new NodeOperationError(context.getNode(), 'Image generation failed', {
					description: response.message || 'Task failed',
				});
			} else if (taskStatus === 'RUNNING' || taskStatus === 'PENDING') {
				// Continue polling
				await sleep(pollingInterval * 1000);
				continue;
			}

			// If no valid response, wait and retry
			await sleep(pollingInterval * 1000);
		}

		throw new NodeOperationError(context.getNode(), 'Task polling timeout', {
			description: `Task did not complete within ${maxPollingTime} seconds`,
		});
	}
}
