# UNIJMU · 集大日常

面向后续微信小程序的网页交互原型。当前 v2.0 将方案 1 的暖白、校园红设计与原工程功能融合，统一为集美大学，不分校区；标语为「诚以待人 毅以处事」。当前不是可直接发布的微信小程序工程。

## 本地预览

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

打开 `http://127.0.0.1:4173/#campus` 进入新版校园首页；无 hash 时保留原社区首页。也可直接打开 `index.html`，运行不依赖外部 CDN。

线上原型已发布到 GitHub 个人主页：`https://hrizonsx.github.io/`；组织仓库的演示地址仍为 `https://unijmu.github.io/demo-repository/`。

修改 Tailwind 类名后运行 `npm run build:css`。手机尺寸直接展示页面；宽屏展示手机预览壳与快捷评审入口。

## 功能融合

| 模块 | 可体验的交互 |
| --- | --- |
| 校园首页 | 建筑插图、日期切换、下一节课、完整课表入口、四个常用工具 |
| 课表 | 日 / 周视图、1–20 周切换、课程详情、课程备忘、无课状态 |
| 学校 / 学院公告 | 首页切换、全部公告、搜索、未读筛选、详情、收藏、提醒状态 |
| 教务工具 | 空教室楼栋筛选、成绩看板、体测表单测算、真实 .ics 文件下载 |
| 原有社区 | 推荐流、二手搜索与分类、商品详情、失物招领、跑腿互助、话题及分步发帖 |
| 消息与我的 | 本地模拟私聊、消息分类、个人资料及公开主页 |

## 演示边界

- 日期固定为 2026-09-18、教学第 3 周，便于稳定演示。课程、公告、成绩、教室和用户均为示例数据。
- 交互状态只保留于本次页面会话，刷新重置；无登录、后端、教务连接或真实消息发送。
- 公告提醒仅演示开关状态，不发送微信订阅消息或系统通知。
- .ics 为可下载的演示课程文件，支持课程备忘与 15 分钟日历提醒；未处理节假日调休，提醒是否生效取决于设备日历。
- 体测使用简化演示算法，不作为正式评分或体测标准依据。
- 保留的社区发布、审核、交易、认证等均是交互演示，不代表已接通相应业务系统。

## 文件

- `index.html`：原工程页面、社区及弹层交互。
- `campus.css` / `campus.js`：新版校园视觉、课表与公告逻辑。
- `assets/campus-architecture.png`：延续之前建筑与钟楼构图的插图素材。
- `assets/campus-life-v2.png` / `assets/campus-study-v2.png`：校园生活横幅与学习物件插图；生成说明见 `assets/illustration-notes.md`。
- `assets/icons/`：Phosphor 官方图标及许可证。
- `assets/utilities.css` / `styles/utilities.css`：本地样式产物及构建入口。
- `scripts/preview.mjs`：本地预览服务。
- `design-qa.md` / `output/design-qa/`：本次验收说明与截图。

## 协作

当前在 `codex/prototype-iteration` 上迭代，并由该分支自动发布 GitHub Pages。提交遵循仓库的 Gitmoji + Conventional Commits 约定及 `.githooks/commit-msg` 校验。
