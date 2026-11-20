# Gamepad Lab · 手柄诊断控制台

一个纯前端的手柄诊断测试中心

## 功能

六项测试共用一套布局，可通过顶部标签切换：

| 测试项     | 路由                        | 说明                                |
| ------- | ------------------------- | --------------------------------- |
| 按键可用性测试 | `/experiment/key`         | 16 个按键实时高亮、已完成勾选标记、LT/RT 数值       |
| 方向键串键测试 | `/experiment/direction`   | 50/100/200 次选择、八方向按动统计、串键提示       |
| 扳机测试    | `/experiment/tigger`      | LT/RT 行程柱状图、线性/非线性识别、死区估算         |
| 摇杆死区测试  | `/experiment/joystick`    | 双摇杆坐标、缩放、中心死区自定义、画圆错误率            |
| 震动测试    | `/experiment/vibrate`     | 扳机力度联动震动、马达强度控制、支持状态提示            |
| 摇杆回报率测试 | `/experiment/diagnostics` | 左/右/双摇杆采样、均值与 P95 统计、Plotly 间隔分布图 |

其他能力：

- 四路手柄槽位与连接状态提示
- 真实手柄与虚拟手柄统一数据层
- 无硬件时可通过虚拟手柄体验全部流程
- 响应式布局，窄屏自动折叠为单列
- 深色科技仪表盘 UI，Lucide 线性图标，玻璃拟态与微动效

## 技术栈

- Vue 3 + TypeScript + Vite 5
- Vue Router 6（路由对齐参考站路径）
- `@vueuse/core` 的 `useGamepad` 负责手柄轮询与连接事件
- Tailwind CSS 3 + `tailwindcss-animate`
- Lucide Vue Next 图标
- Plotly.js 交互式图表
- ECharts / vue-echarts（框架规范要求的补充图表库）

## 本地运行

环境要求：Node.js 18+（推荐 20 LTS）与 npm。

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

浏览器打开：

```
http://localhost:5173/experiment/diagnostics
```

其他命令：

```bash
npm run build       # 类型检查 + 生产构建，产物在 dist/
npm run preview     # 预览构建产物
npm run typecheck   # 仅类型检查
```

## 使用说明

### 真实手柄

1. 使用支持 Gamepad API 的 Chrome / Edge / Firefox，请勿使用 IE 或兼容模式
2. 连接手柄后，**先按一次任意按键**，页面才会识别到设备
3. 在顶部槽位中选择要测试的手柄
4. 进入对应测试页按提示操作

### 虚拟手柄（无硬件演示）

1. 展开页面底部的「虚拟手柄控制台」
2. 点击「启动虚拟模式」
3. 可点击虚拟按键、拖动摇杆/扳机滑杆，或点击「自动画圆」
4. 所有测试页会实时使用虚拟手柄数据流

注意：点击某个槽位会退出虚拟模式并切回真实设备。

## 目录结构

```
src/
├── components/        # 布局、手柄模型、通用组件
├── composables/       # 手柄轮询中枢、虚拟手柄、回报率、Plotly 封装
├── data/              # 文案与外链配置
├── router/            # 六项测试路由
├── styles/            # 全局样式与设计令牌
├── types/             # TypeScript 类型
├── utils/             # 按键/轴映射、统计函数
└── views/             # 六个测试视图
```

## 部署到 GitHub Pages

GitHub Pages 只提供静态托管，需先构建。推荐用 GitHub Actions 自动部署：

1. 修改 `vite.config.ts`，在 `defineConfig` 中添加：
   
   ```ts
   base: '/你的仓库名/',
   ```
   
   若仓库名为 `用户名.github.io`，则填 `/`。

2. 修改 `src/router/index.ts`，将 `createWebHistory` 改为 `createHashHistory`：
   
   ```ts
   import { createRouter, createHashHistory } from 'vue-router'
   
   const router = createRouter({
     history: createHashHistory(),
     routes,
   })
   ```
   
   GitHub Pages 不支持 SPA 的 History 回退，必须使用 Hash 路由。

3. 新建 `.github/workflows/deploy.yml`：
   
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm install
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist
   
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

4. 提交并推送后，到仓库 `Settings` → `Pages` → `Source` 选择 `GitHub Actions`。

部署完成后访问：

```
https://你的用户名.github.io/你的仓库名/#/experiment/diagnostics
```

## 说明

- 回报率在浏览器端基于 `requestAnimationFrame` 采样，受显示器刷新率影响，属于近似值；精确测量请使用原站桌面工具。
- 震动功能依赖手柄和浏览器的 `vibrationActuator` 支持，不支持时页面会给出提示。
- 项目为纯前端实现，无后端、无数据库。
