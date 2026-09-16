# 我的技术博客

一个用纯 **HTML5 + CSS + JavaScript** 搭建的轻量个人技术博客，无框架、无构建工具、无依赖。

## 快速开始

因为没有任何依赖，直接打开即可：

- **方式一**：双击 `index.html` 用浏览器打开
- **方式二**：在项目目录启动一个静态服务器（推荐，路径更规范）：

  ```bash
  cd tech-blog
  python3 -m http.server 8000
  ```

  然后访问 <http://localhost:8000>

## 目录结构

```
tech-blog/
├── index.html        # 首页：文章列表 + 搜索 + 分类筛选
├── post.html         # 文章详情页（通过 ?id=xxx 加载）
├── about.html        # 关于页
├── css/
│   └── style.css     # 全部样式（含明暗主题）
└── js/
    ├── posts.js      # 文章数据（写新文章改这里）
    └── main.js       # 渲染 / 搜索 / 主题切换逻辑
```

## 如何写新文章

打开 `js/posts.js`，在 `POSTS` 数组里追加一个对象即可：

```js
{
  id: 'my-new-post',            // 唯一标识，英文短横线
  title: '我的新文章标题',
  date: '2026-09-16',
  category: '前端开发',
  tags: ['HTML', 'CSS'],
  excerpt: '一句话摘要，显示在首页卡片上',
  content: [                    // 正文由「块」组成
    { type: 'h2',  text: '小节标题' },
    { type: 'p',   text: '正文段落，用 `反引号` 表示行内代码' },
    { type: 'code', lang: 'js', text: 'console.log("代码块");' },
    { type: 'list', items: ['列表项一', '列表项二'] },
    { type: 'quote', text: '引用内容' }
  ]
}
```

支持的块类型：`h2`、`h3`、`p`、`code`、`list`、`quote`。

## 自定义

- **站点名称**：修改各 HTML 里的 `<title>` 和 `<a class="logo">` 内容
- **主题色**：修改 `css/style.css` 顶部 `:root` 里的 `--accent` 变量
- **关于页信息**：修改 `about.html`
- **明暗主题**：右上角按钮切换，自动记忆偏好，默认跟随系统

## 部署

把整个 `tech-blog` 目录推到任意静态托管即可，例如：

- GitHub Pages
- Vercel / Netlify（直接拖拽目录）
- 任意 Nginx / 对象存储静态站点
