# AGENT.md

本仓库是 UNIJMU 校园聚合服务平台的 `demo-repository`（高保真可交互原型与静态演示站点）。

## 规则来源

1. 先遵循工作区规则：`unijmu-docs` 仓库根的 `AGENT.md`（本地路径 `~/Desktop/UNIJMU/AGENT.md`）。
2. 本文件只补充本仓库特有约定，不重复也不削弱工作区规则。

## 本仓库约定

- 职责：维护 UNIJMU 小程序高保真交互原型、静态演示网页与评审交付物。
- 技术栈：单文件自包含 HTML5 + Tailwind CSS + 原生 ES6，零构建依赖，开箱即用。
- Git 与提交规范：提交遵循 Gitmoji + Conventional Commits：`<emoji> <type>(<scope>): <描述>`。本地 hook 与 CI 都会校验，规范与 emoji 对照表见 `unijmu-docs` 的 `document/ENGINEERING_GUIDE.md`。
- 不提交包含敏感信息、密钥、真实账号与机器配置的文件。
