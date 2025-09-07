# Qwen-Image 项目开发指导文档

## 项目概述

本项目是一个双重用途的图像生成包，基于通义千问大模型提供图像生成功能：

1. **n8n 节点**：在 n8n 工作流中集成 AI 图像生成功能
2. **AI 工具**：支持 OpenAI Functions 和 LangChain 集成的独立工具

项目使用 TypeScript 开发，遵循 n8n 节点开发规范，同时提供标准化的 AI 工具接口。

### 版本信息
- 当前版本：2.0.0
- 发布状态：已发布到 npm

## 功能分析

### 核心功能
- **双功能性**：同时支持 n8n 节点和 AI 工具调用
- **高质量生成**：基于通义千问模型生成高质量图像
- **多尺寸支持**：支持多种图像尺寸配置（1024x1024、720x1280、1280x720 等）
- **异步处理**：完整的异步任务处理和轮询机制
- **错误处理**：完善的错误处理和重试机制
- **灵活配置**：支持自定义 API 端点和参数
- **AI 集成**：支持 OpenAI Functions 和 LangChain 工具调用

## 开发规范

### 项目结构
```
n8n-nodes-qwen-image/
├── credentials/           # 凭据配置
│   └── ModelScopeApi.credentials.ts
├── nodes/                # 节点和工具实现
│   ├── QwenImage/        # n8n 节点
│   │   ├── QwenImage.node.ts
│   │   ├── QwenImage.node.json
│   │   ├── QwenImage.svg
│   │   └── resource/
│   │       └── QwenImageAPI.ts  # 核心 API 类
│   └── help/             # AI 工具和类型定义
│       ├── builder/
│       │   └── ResourceBuilder.ts
│       ├── type/         # 共享类型定义
│       │   ├── IResource.ts
│       │   └── index.ts
│       └── utils/
│           └── QwenImageTool.ts  # AI 工具类
├── dist/                 # 编译输出
├── index.ts             # 项目入口文件
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── README.md
```

### 技术架构

#### 核心类结构

**QwenImageAPI 类**（`nodes/QwenImage/resource/QwenImageAPI.ts`）
- 核心 API 交互类，处理与通义千问 API 的所有通信
- 主要方法：
  - `generateImage()`: 生成图像的主入口
  - `submitTask()`: 提交图像生成任务
  - `pollTaskResult()`: 轮询任务结果
  - `downloadImage()`: 下载生成的图像

**QwenImageTool 类**（`nodes/help/utils/QwenImageTool.ts`）
- AI 工具调用类，提供标准化的工具接口
- 支持 OpenAI Functions 格式
- 支持 LangChain 集成
- 提供工具元数据和执行方法

#### 节点配置
- **displayName**: "Qwen Image"
- **name**: "qwenImage"
- **icon**: "file:QwenImage.svg"
- **group**: ["transform"]
- **version**: 1
- **description**: "Generate images using Qwen model"
- **defaults**: name 默认为 "Qwen Image"
- **inputs**: ["main"]
- **outputs**: ["main"]
- **credentials**: ["modelScopeApi"]

#### 认证配置

**ModelScopeApi.credentials.ts**:
- **name**: "modelScopeApi"
- **displayName**: "ModelScope API"
- **properties**:
  - `apiKey`: API 密钥（必填，密码类型）
  - `baseUrl`: API 基础 URL（可选，默认值）
- **test**: 包含测试请求配置

#### 类型定义

**共享类型**（`nodes/help/type/index.ts`）:
- `QwenImageConfig`: 配置接口
- `ImageGenerationParams`: 图像生成参数
- `QwenImageResponse`: API 响应类型
- `ToolCallResult`: 工具调用结果类型

### 双重导出和使用方式

#### 项目入口（`index.ts`）
```typescript
export { QwenImageTool } from './nodes/help/utils/QwenImageTool';
export * from './nodes/help/type';
```

#### n8n 节点使用
- 通过 n8n 包管理器安装
- 在工作流中直接使用 Qwen Image 节点
- 配置 ModelScope API 凭据

#### AI 工具使用
```typescript
import { QwenImageTool } from 'n8n-nodes-qwen-image';

// OpenAI Functions 集成
const tool = new QwenImageTool(config);
const result = await tool.execute(params);

// LangChain 集成
const langchainTool = tool.toLangChainTool();
```

### 节点主逻辑

#### execute 方法实现
1. **参数获取**：从节点参数和输入数据中获取配置
2. **API 调用**：使用 QwenImageAPI 类进行图像生成
3. **结果处理**：处理 API 响应，返回图像数据
4. **错误处理**：捕获和处理各种异常情况

### 节点参数配置

#### 主要参数
- **operation**: 操作类型（默认："generate"）
- **prompt**: 图像描述提示词（必填）
- **negativePrompt**: 负面提示词（可选）
- **size**: 图像尺寸（可选，多种预设尺寸）
- **pollInterval**: 轮询间隔（默认：2000ms）
- **maxPollAttempts**: 最大轮询次数（默认：30）

## 开发要求

### 代码质量
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 规则
- 添加适当的类型注解
- 编写清晰的注释
- 保持代码模块化和可复用性

### 错误处理
- 实现完整的错误捕获机制
- 提供有意义的错误信息
- 支持错误重试机制
- 记录详细的错误日志
- 处理网络超时和 API 限制

### AI 工具开发指导

#### 工具函数定义
- 遵循 OpenAI Functions 规范
- 提供清晰的参数描述
- 实现标准化的执行接口
- 支持异步操作

#### LangChain 集成
- 实现 `toLangChainTool()` 方法
- 提供工具元数据
- 支持链式调用

## 测试验证

### 单元测试
- 测试 QwenImageAPI 类的所有方法
- 测试 QwenImageTool 工具调用
- 测试参数验证和类型检查
- 测试错误处理和重试机制
- 测试数据转换和格式化

### 集成测试
- 测试完整的图像生成流程
- 测试 n8n 节点集成
- 测试 AI 工具调用集成
- 测试不同参数组合
- 测试异常情况处理
- 测试性能表现

### AI 工具测试
- 测试 OpenAI Functions 兼容性
- 测试 LangChain 集成
- 测试工具元数据正确性
- 测试异步执行逻辑

## 发布准备

### 构建流程
1. 运行 `npm run build` 编译 TypeScript
2. 运行 `npm run lint` 检查代码质量
3. 运行 `npm run format` 格式化代码
4. 检查 `dist` 目录生成的文件
5. 验证 `package.json` 配置正确
6. 确保所有依赖项已正确安装

### 发布检查
- 版本号更新（当前：2.0.0）
- 更新 CHANGELOG.md
- 文档更新（README.md）
- 测试通过
- 构建成功
- 双重导出验证
- AI 工具功能验证

### 发布流程
1. 确保登录 npm：`npm whoami`
2. 发布到 npm：`npm publish`
3. 验证发布结果
4. 更新版本标签

## 注意事项

### 重要修复记录

#### tsconfig.json 路径映射问题
- **问题**：`@/*` 路径错误地指向了不存在的 `src/*` 目录
- **修复**：将路径映射改为 `@/*: ["./*"]`
- **影响**：解决了项目报红和编译错误问题

#### 依赖管理
- 确保所有 peer dependencies 正确配置
- 注意 n8n 版本兼容性
- 定期更新依赖包版本

### 最佳实践

#### API 调用
- 实现适当的重试机制
- 处理 API 限流和超时
- 缓存重复请求结果
- 提供详细的错误信息

#### 性能优化
- 使用异步处理避免阻塞
- 实现合理的轮询间隔
- 优化图像下载和处理
- 监控内存使用情况

#### 安全考虑
- 安全存储 API 密钥
- 验证输入参数
- 防止注入攻击
- 限制文件大小和类型

## 参考资源

### 官方文档
- [n8n 节点开发文档](https://docs.n8n.io/integrations/creating-nodes/)
- [通义千问 API 文档](https://help.aliyun.com/zh/dashscope/)
- [ModelScope API 文档](https://www.modelscope.cn/docs)

### 开发工具
- TypeScript 官方文档
- ESLint 配置指南
- Jest 测试框架
- OpenAI Functions 规范
- LangChain 工具开发指南

### 社区资源
- n8n 社区论坛
- GitHub Issues 和讨论
- 相关开源项目参考