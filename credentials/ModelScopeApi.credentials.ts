import {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ModelScopeApi implements ICredentialType {
	name = 'modelScopeApi';
	displayName = 'ModelScope API';
	documentationUrl = 'https://modelscope.cn';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'ModelScope API Key from https://modelscope.cn',
			placeholder: 'sk-...',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api-inference.modelscope.cn/',
			description: 'ModelScope API base URL',
			required: true,
		},
	];

	// Add credential test functionality
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: 'v1/images/generations',
			method: 'POST',
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
				'Content-Type': 'application/json',
				'X-ModelScope-Async-Mode': 'true',
			},
			body: JSON.stringify({
				model: 'Qwen/Qwen-Image',
				prompt: 'test connection',
			}),
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'API Key验证成功',
					key: 'task_id',
					value: 'string',
				},
			},
		],
	};
}
