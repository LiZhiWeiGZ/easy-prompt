# Prompt Studio 项目规范

## 项目定位

这是一个 Manifest V3 Chrome 扩展 MVP，用于把 Prompt 提问方法论做成可视化生成器，并在主流 AI 对话网站中复制或插入生成结果。

当前项目是静态前端扩展，不包含后端服务、构建流程、包管理配置或自动化测试框架。

## 技术约束

- 使用原生 HTML、CSS、JavaScript。
- 不引入构建工具，除非任务明确要求并先说明收益和影响。
- 不新增运行时依赖，除非原生能力无法满足需求并先说明原因。
- 遵循 Chrome Manifest V3 约束。
- 插件页面、content script、options page 之间通过现有 `chrome.*` API 和 `postMessage` 模式协作。

## 目录约定

- `manifest.json`：扩展清单、权限、入口和资源声明。
- `launcher.html` / `src/launcher.js`：浏览器扩展图标弹窗的小启动器。
- `popup.html` / `src/popup.js` / `src/popup.css`：Prompt 生成器主界面。
- `options.html` / `src/options.js`：扩展配置页。
- `src/content.js` / `src/content.css`：注入 AI 网站的悬浮入口、面板和输入框插入逻辑。
- `src/data.js`：平台、角色、默认配置等静态数据。
- `src/prompt-engine.js`：Prompt 拼装逻辑。
- `README.md`：项目介绍和安装使用方式。
- `ROADMAP.md`：当前进度、待办、阻塞和验证记录。
- `FEATURE_MAP.md`：Prompt 方法论到功能的映射。

## 修改规则

- 优先做局部、直接、可回退的小改动。
- 不顺手重构无关代码。
- 不格式化无关文件。
- 修改 UI 时保持现有简洁工具型风格，不做营销页或大幅视觉改版。
- 新增 Prompt 技巧时，需要同步更新：
  - `src/popup.js` 的技巧表单配置。
  - `src/prompt-engine.js` 的生成逻辑。
  - 必要时更新 `src/data.js` 的静态数据。
  - 如影响项目进度，更新 `ROADMAP.md`。
- 新增支持站点时，需要同步检查：
  - `src/content.js` 的 `supportedAiHosts`。
  - 输入框选择器和插入逻辑是否覆盖该站点。
  - `README.md` 是否需要更新支持平台说明。

## 权限与安全

- 不扩大 `host_permissions` 或新增 Chrome 权限，除非功能确实需要。
- 涉及权限变更时，必须说明为什么需要、影响范围和潜在风险。
- 不在代码中写入密钥、token、账号或私有配置。
- 不记录用户 Prompt 内容到远端；当前项目只使用浏览器本地存储。

## 验证要求

- 修改静态代码后，至少做语法级或人工检查。
- 修改扩展行为后，优先在 Chrome 通过「加载已解压的扩展程序」验证。
- 修改插入逻辑后，需要在至少一个支持的 AI 网站验证：
  - 悬浮按钮显示。
  - 面板能打开和关闭。
  - Prompt 能插入输入框。
- 无法完成浏览器验证时，必须在汇报中明确说明。

## 文档同步

- 每次完成开发、修复、文档补齐或重要调研后，必须更新 `ROADMAP.md`。
- `README.md` 只写项目介绍、安装和使用方式。
- `ROADMAP.md` 写当前阶段、已完成、进行中、待办、阻塞和最近验证。
