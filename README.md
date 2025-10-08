# 电商后台管理系统 - 前端项目

基于 Vue 3 + TypeScript + Element Plus 的现代化电商后台管理系统前端应用。

## ✨ 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API
- 💪 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Element Plus** - 优秀的 Vue 3 UI 组件库
- 📦 **Pinia** - 新一代状态管理工具
- 🛣️ **Vue Router** - 官方路由管理器
- 📡 **Axios** - 基于 Promise 的 HTTP 客户端
- 📊 **ECharts** - 强大的数据可视化库
- ⚡ **Vite** - 下一代前端构建工具
- 🔐 **JWT** - Token 认证机制
- 🎯 **ESLint + Prettier** - 代码规范和格式化

## 📋 功能模块

- ✅ **用户认证** - 登录/登出、Token 管理
- ✅ **用户管理** - 用户增删改查、状态管理、密码重置
- ✅ **角色权限** - 角色管理、权限配置
- ✅ **商品分类** - 分类树形管理
- ✅ **商品管理** - 商品发布、编辑、上下架、库存管理
- ✅ **订单管理** - 订单查询、发货、取消
- ✅ **数据统计** - 仪表盘数据展示、图表分析

## 🛠️ 技术栈

| 技术         | 版本   | 说明                   |
| ------------ | ------ | ---------------------- |
| Vue          | 3.5.x  | 渐进式 JavaScript 框架 |
| TypeScript   | 5.9.x  | JavaScript 的超集      |
| Element Plus | 最新版 | Vue 3 UI 组件库        |
| Pinia        | 3.0.x  | Vue 状态管理库         |
| Vue Router   | 4.5.x  | Vue 路由管理           |
| Axios        | 最新版 | HTTP 客户端            |
| ECharts      | 最新版 | 数据可视化             |
| Day.js       | 最新版 | 时间处理库             |
| Vite         | 7.1.x  | 构建工具               |

## 📁 项目结构

```
admin-ui/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口封装
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0
- npm >= 10.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5174

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

### 类型检查

```bash
npm run type-check
```

## 🔑 测试账号

| 角色       | 用户名   | 密码     | 权限             |
| ---------- | -------- | -------- | ---------------- |
| 超级管理员 | admin    | admin123 | 所有权限         |
| 运营管理员 | operator | admin123 | 商品、订单、营销 |
| 数据分析员 | analyst  | admin123 | 仅查看权限       |

## 🌐 后端接口

- **接口基础路径**: `http://localhost:8080/api/admin/v1`
- **接口文档地址**: `http://localhost:8080/api/admin/v1/doc.html`
- **认证方式**: JWT Token（Bearer Token）

详细接口文档请查看 [API接口文档-前端版.md](./API接口文档-前端版.md)

## 📝 开发文档

- [前端开发计划](./前端开发计划.md) - 详细的开发计划和进度跟踪
- [需求规格说明书](./需求规格文档说明书.md) - 系统需求详细说明
- [API接口文档](./API接口文档-前端版.md) - 后端接口文档

## 💡 开发规范

### 命名规范

- **文件命名**: kebab-case（如：user-list.vue）
- **组件命名**: PascalCase（如：UserList）
- **变量命名**: camelCase（如：userList）
- **常量命名**: UPPER_SNAKE_CASE（如：API_BASE_URL）

### Git 提交规范

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变动

## 📦 浏览器支持

| Browser | Version |
| ------- | ------- |
| Chrome  | >= 90   |
| Firefox | >= 88   |
| Edge    | >= 90   |
| Safari  | >= 14   |

## 🤝 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

[MIT License](LICENSE)

## 👨‍💻 开发者

- **开发者**: 苏垒
- **学号**: 230601186
- **专业班级**: 计应23.8班

## 📞 联系方式

如有问题，请查看：

- 开发日志: `项目开发日志.md`
- API文档: [API接口文档-前端版.md](./API接口文档-前端版.md)
- 在线文档: http://localhost:8080/api/admin/v1/doc.html

---

**项目版本**: v1.0  
**最后更新**: 2025-10-06  
**项目状态**: ✅ 第一阶段已完成，进入第二阶段开发
