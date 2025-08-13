# VSCode 项目依赖管理插件

一个专注于项目依赖管理的 VSCode 扩展插件，提供可视化的依赖包管理和源码查看功能。

## 🚀 功能特性

### 项目依赖管理
- **依赖可视化**：以表格形式展示项目的所有依赖包
- **源码查看**：直接查看依赖包的源代码
- **依赖更新**：一键更新指定依赖包到最新版本
- **依赖删除**：快速移除不需要的依赖包
- **多包管理器支持**：支持 npm、pnpm、tnpm 等主流包管理器

## 📦 安装

### 从 VSCode 市场安装
1. 打开 VSCode
2. 进入扩展面板 (Ctrl+Shift+X / Cmd+Shift+X)
3. 搜索 "project-dep-view"
4. 点击安装

### 手动安装
1. 下载最新版本的 `.vsix` 文件
2. 在 VSCode 中运行 `Extensions: Install from VSIX...`
3. 选择下载的 `.vsix` 文件

## 🎯 使用方法

### 查看项目依赖
1. 在资源管理器中选中项目的 `package.json` 文件
2. 右键点击，选择 **"项目依赖"**
3. 首次加载需要等待几秒钟，之后将打开依赖管理面板

![项目依赖管理](./image/dep-handle.png)

### 依赖操作
- **查看源码**：点击依赖包旁边的 "查看" 按钮
- **更新依赖**：点击 "更新" 按钮将依赖升级到最新版本
- **删除依赖**：点击 "删除" 按钮移除不需要的依赖

### 配置包管理器
在 VSCode 设置中配置使用的包管理器：
- 打开设置 (Ctrl+, / Cmd+,)
- 搜索 `vscode-plugin-utils.packageHandlerUtils`
- 选择 npm、pnpm 或 tnpm

## ⚙️ 配置选项

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `vscode-plugin-utils.packageHandlerUtils` | string | `npm` | 设置项目使用的包管理器，支持 npm、pnpm、tnpm |

## 🛠️ 开发

### 环境要求
- Node.js >= 16
- VSCode >= 1.85.0

### 本地开发
```bash
# 克隆项目
git clone https://github.com/EvalGitHub/vscode-plugins-utils.git

# 安装依赖
npm install

# 编译项目
npm run compile

# 开发模式（监听文件变化）
npm run watch

# 运行测试
npm test
```

### 项目结构
```
vscode-plugins-utils/
├── src/
│   ├── extension.ts                 # 扩展主入口
│   ├── command/
│   │   └── project-dep/            # 项目依赖管理功能
│   │       ├── index.ts            # 依赖管理主逻辑
│   │       ├── utils.ts            # 工具函数
│   │       └── view-dep-code.ts    # 依赖代码查看
│   └── vite-project/               # Webview 前端项目
├── image/                          # 图标和图片资源
├── package.json                    # 扩展配置
└── README.md                       # 项目说明
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [VSCode 扩展开发文档](https://code.visualstudio.com/api)
- [项目仓库](https://github.com/EvalGitHub/vscode-plugins-utils)

---

**享受高效的依赖管理体验！**
