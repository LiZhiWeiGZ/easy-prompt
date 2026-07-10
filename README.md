# Prompt Studio Chrome Extension

一个基于《02.AI 学习之路之「学会跟 AI 说话：Prompt 从入门到精通」》整理出来的 Chrome 插件 MVP。

## 当前能力

- 每个 Prompt 技巧独立成一个页签
- 左侧技巧按对话开场、基础、进阶技巧、高级用法分组
- 每个页签都有该技巧的简短说明
- 新增「角色库」页签，用于生成对话开场 Prompt，点击角色标签即可预览
- 角色库首批支持：医生、律师、投资专家、股票分析师、产品经理、运营专家、公众号写作教练、短视频编导、软件架构师、面试官
- 角色 Prompt 不需要填写问题，默认约束：中文回答、结论先行、严谨简洁、不编造、不确定就说明缺口
- 「万能公式」页签包含：角色、任务、背景、格式、限制
- 覆盖文章里的进阶技巧页签：
  - 说原因
  - 给示例
  - 分步思考
  - 长文后问
  - 指定格式
  - 不要做什么
- 覆盖文章里的高级用法页签：
  - Prompt 链
  - 反驳自己
  - 多角色视角
  - 让 AI 写 Prompt
  - AI 采访我
  - 给 AI 压力
  - 迭代修改
- 支持平台适配：
  - ChatGPT
  - Claude
  - Gemini
  - Kimi
  - 豆包
  - 元宝
  - 通义千问
  - DeepSeek
- 支持复制 Prompt
- 支持把最近一次生成的 Prompt 插入当前网页输入框
- 右下角 `Prompt` 按钮可展开完整页面内面板
- 右下角按钮只在已支持的 AI 对话网站显示
- 右上角扩展图标只作为小启动器，不再承载完整编辑界面
- 平台适配为可选项，勾选后才会写入生成结果

## 安装

1. 打开 Chrome 扩展管理页：`chrome://extensions`
2. 开启「开发者模式」
3. 选择「加载已解压的扩展程序」
4. 选择当前目录下的 `prompt-studio-extension/`

## 目录

```text
prompt-studio-extension/
  manifest.json
  popup.html
  options.html
  src/
    content.css
    content.js
    data.js
    options.js
    popup.css
    popup.js
    prompt-engine.js
```

## 下一步建议

- 增加模板编辑器，让你把书里的固定套路保存成自己的模板库
- 增加平台 DOM 适配层，让 ChatGPT、Claude、豆包等站点插入更稳定
- 增加 Prompt 历史记录、收藏夹和变量预设
- 增加“从选中文本生成 Prompt”的右键菜单入口
