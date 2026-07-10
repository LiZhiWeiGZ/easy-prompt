# Prompt Studio Roadmap

## 当前阶段

MVP 整理与基础规范补齐阶段。

项目当前是一个可直接加载的静态 Chrome 扩展，核心代码已具备 Prompt 生成器、角色库、平台适配选项、页面悬浮入口和插入当前输入框的逻辑。当前版本 `0.1.16` 已完成权限收敛、视觉优化、站内紧凑面板、固定布局、顶部动作区、悬浮入口优化、图标替换、角色库文案优化、顶部平台栏压缩、多行标签高度修正、底部动作区精简、平台下拉框宽度修正、站内面板外框收窄、复制成功提示、动作按钮配色和左侧标签栏滚动条隐藏。当前项目已上传到 GitHub 仓库 `LiZhiWeiGZ/easy-prompt`。

## 已完成

- 2026-07-09：补充项目级 `AGENTS.md`，明确本项目技术栈、目录约定、修改规则、权限安全和验证要求。
- 2026-07-09：补充 `ROADMAP.md`，建立项目进度记录。
- 2026-07-10：权限收敛版本人工验收通过，确认当前版本可继续作为后续优化基线。
- 2026-07-10：完成 `0.1.5` 视觉优化版本，包含扩展页面美化、站内紧凑面板、右下角悬浮入口优化和新扩展图标。
- 2026-07-10：完成 `0.1.6` 布局优化版本，固定页面整体滚动边界、固定底部三个动作按钮、精简顶部栏，并优化角色库职业说明。
- 2026-07-10：完成 `0.1.7` 顶部平台栏压缩版本，移除顶部副标题，平台标签、下拉框和平台适配勾选控件改为横向紧凑布局。
- 2026-07-10：完成 `0.1.8` 顶部平台栏微调版本，移除「平台」可见文字，恢复「启用平台适配」说明，并让下拉框、勾选框和说明文字保持同一水平线。
- 2026-07-10：完成 `0.1.9` 顶部说明和标签高度修正版本，将顶部品牌名替换为插件功能说明，并修正左侧多行标签按钮高度。
- 2026-07-10：完成 `0.1.10` 顶部平台下拉框和底部动作区精简版本，横向加宽平台下拉框，移除可见生成按钮，仅保留复制和插入，并压缩底部按钮区域高度。
- 2026-07-10：完成 `0.1.11` 平台下拉框宽度修正版本，进一步加宽平台下拉框并禁止平台控件在顶部栏中被 flex 压缩。
- 2026-07-10：完成 `0.1.12` 平台下拉框宽度回调版本，将平台下拉框宽度调整为上一版的一半，并保留不被 flex 压缩的布局规则。
- 2026-07-10：完成 `0.1.13` 站内面板外框收窄版本，将站内弹出面板最大宽度从 `580px` 调整为 `560px`，关闭按钮随面板右边界同步左移。
- 2026-07-10：完成 `0.1.14` 顶部动作区重排版本，移除顶部说明文案，将平台控件放到顶部左侧，复制和插入移动到顶部右侧，紧凑模式隐藏底部结果区并让表单区域向下扩展。
- 2026-07-10：完成 `0.1.15` 复制反馈和按钮配色版本，复制成功后在扩展页内弹出提示，站内面板场景同步通知父页面提示，并为复制和插入按钮设置不同颜色。
- 2026-07-10：完成 `0.1.16` 左侧标签栏滚动条隐藏版本，隐藏标签栏可见滚动条并保留滚轮滚动能力。
- 2026-07-10：用户反馈 `0.1.16` 人工验收完成，确认当前前端视觉优化进度已保存。
- 2026-07-10：补充 `.gitignore` 并准备本地 Git 仓库，用于上传 GitHub。
- 2026-07-10：完成 GitHub 远端上传，仓库为 `https://github.com/LiZhiWeiGZ/easy-prompt`。
- 2026-07-11：更新 `README.md` 项目简介，移除课程来源描述和 README 末尾建议段落。

## 进行中

- 暂无正在开发的任务。

## 待办

- 梳理真实支持站点的 DOM 适配差异，必要时拆出平台适配层。
- 增加 Prompt 历史记录、收藏夹或变量预设前，先确认最小产品范围。
- 如需要自动化验证，再评估是否引入最小测试或 lint 工具。

## 阻塞

- 当前没有影响已验收版本运行的已知功能阻塞。
- Chrome 控制插件在扩展面板打开后会阻止继续自动化操作扩展 UI，后续如要做自动化回归需要另选验证方式。
- 当前机器的 Google Chrome 命令行 `--load-extension` 路径未能加载本地 unpacked extension；最小测试扩展同样未注入，无法用隔离 Chrome 自动替代主 Chrome 做完整自动化验证。
- 本机 GitHub HTTPS 凭据不可用，已改用 GitHub 插件 API 完成远端上传；后续如需直接 `git push`，需要先配置本机 GitHub 凭据。
- 当前没有自动化测试框架，代码变更主要依赖人工验证。

## 最近验证

- 2026-07-09：只读检查项目结构、`README.md`、`manifest.json`、`src/data.js`、`src/prompt-engine.js`、`src/popup.js`、`src/content.js`、`src/launcher.js` 和 `src/options.js`。
- 2026-07-09：补充前确认当前目录不存在项目级 `AGENTS.md`、`ROADMAP.md`、`CLAUDE.md`，且当前目录不是 Git 仓库。
- 2026-07-09：只读检查新增的 `AGENTS.md` 和 `ROADMAP.md` 已落盘。
- 2026-07-09：`manifest.json` 通过 JSON 解析检查；`host_permissions`、`content_scripts.matches` 和 `web_accessible_resources.matches` 已移除 `<all_urls>`。
- 2026-07-09：本地检查 `src/content.js` 的 19 个支持域名均存在对应 HTTPS 匹配规则；三处 manifest 匹配表均为 38 条。
- 2026-07-09：主 Chrome 新开 `https://www.deepseek.com/` 后可见右下角 `Prompt` 悬浮按钮，说明现有安装扩展在支持站点上能注入 content script。
- 2026-07-09：尝试使用隔离 Chrome 加载当前 unpacked extension 做完整自动化验证；当前 Google Chrome 命令行加载本地 extension 未生效，最小 MV3 测试扩展也未注入，排除为本项目 manifest 单点问题。
- 2026-07-10：用户反馈人工验收通过，当前权限收敛版本验收完成。
- 2026-07-10：`0.1.5` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认 `icons/icon16.png`、`icons/icon32.png`、`icons/icon48.png`、`icons/icon128.png` 已生成。
- 2026-07-10：`0.1.6` 通过 `node --check src/popup.js`、`node --check src/content.js`、`node --check src/data.js` 和 `manifest.json` 解析检查。
- 2026-07-10：`0.1.7` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认顶部栏 DOM 已精简为标题、平台标签、平台下拉框和平台适配勾选控件。
- 2026-07-10：`0.1.8` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认顶部栏 DOM 已移除可见「平台」文字，并保留同一水平线上的下拉框、勾选框和「启用平台适配」说明。
- 2026-07-10：`0.1.9` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认顶部标题已替换为插件功能说明，左侧标签按钮支持多行内容自然撑高。
- 2026-07-10：`0.1.10` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认可见生成按钮已移除，复制和插入会在结果为空时自动生成 Prompt，平台下拉框和底部动作区样式已更新。
- 2026-07-10：`0.1.11` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认平台下拉框正常模式宽度为 `300px`，紧凑模式宽度为 `240px`，且平台控件不会被顶部栏 flex 压缩。
- 2026-07-10：`0.1.12` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认平台下拉框正常模式宽度为 `150px`，紧凑模式宽度为 `120px`，且继续保持不被 flex 压缩。
- 2026-07-10：`0.1.13` 通过 `node --check src/content.js`、`node --check src/popup.js` 和 `manifest.json` 解析检查；确认站内弹出面板最大宽度为 `560px`，关闭按钮会随面板右边界同步左移。
- 2026-07-10：`0.1.14` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认顶部说明文案已移除，平台控件位于顶部左侧，复制和插入按钮位于顶部右侧，紧凑模式底部结果区隐藏且表单区域向下扩展。
- 2026-07-10：`0.1.15` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认复制成功提示逻辑、站内父页面复制提示消息和复制/插入按钮配色规则已写入。
- 2026-07-10：`0.1.16` 通过 `node --check src/popup.js`、`node --check src/content.js` 和 `manifest.json` 解析检查；确认左侧标签栏已通过 `scrollbar-width: none` 和 `::-webkit-scrollbar` 隐藏可见滚动条。
- 2026-07-10：用户反馈 `0.1.16` 人工验收完成。
- 2026-07-10：本地创建 Git commit `08bc7b1` 和 `db638d6`；远端 `main` 通过 GitHub 插件 API 更新到 `c16af7c`，并确认远端 tree 包含 21 个项目文件。
- 2026-07-11：检查 `README.md` 已移除原课程来源描述和 README 末尾建议段落。
