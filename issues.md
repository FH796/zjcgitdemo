# 代码问题清单（issues）

> 分析对象：`dev` 分支全部代码
> 分析时间：2026-09-16
> 范围：index.html / about.html / post.html / css/style.css / js/main.js / js/posts.js / js/sorting.js / README.md

## 概览

| 编号 | 严重程度 | 类别 | 问题简述 | 位置 |
| --- | --- | --- | --- | --- |
| 1 | 🔴 高 | 功能 Bug | 搜索框承诺搜「内容」，实际正文不参与搜索 | `index.html` / `js/main.js` |
| 2 | 🔴 高 | 性能 / 健壮性 | 快速排序对已排序/逆序数组退化为 O(n²) 且可能栈溢出 | `js/sorting.js` |
| 3 | 🟠 中 | 健壮性 | 渲染列表块时未校验 `block.items`，字段缺失会抛错 | `js/main.js` |
| 4 | 🟠 中 | 可维护性 | 主题初始化脚本在 3 个 HTML 中重复 | `*.html` |
| 5 | 🟠 中 | 可维护性 | `POSTS` 用顶层 `var` 挂到 `window`，污染全局命名空间 | `js/posts.js` |
| 6 | 🟠 中 | 工程 | 新增 `js/sorting.js` 未在任何页面引入，属「死代码」 | `index.html` 等 |
| 7 | 🟡 低 | 文档 | README 目录名 `tech-blog` 与实际 `zjcgitdemo` 不一致 | `README.md` |
| 8 | 🟡 低 | 文档 | README 目录结构未列出新增的 `js/sorting.js` | `README.md` |
| 9 | 🟡 低 | SEO | about.html / post.html 缺少 `meta description` | `about.html` / `post.html` |
| 10 | 🟡 低 | 可访问性 | 主题切换按钮无状态语义、缺 `prefers-reduced-motion` 处理 | `*.html` / `js/main.js` / `style.css` |
| 11 | 🟡 低 | 性能 | 归并排序每层递归 `slice` 复制数组，内存开销偏大 | `js/sorting.js` |

---

## 详细说明

### 1. 🔴 搜索框承诺与实现不一致（功能 Bug）

**位置**：`index.html:37`、`js/main.js:87-96`

搜索框占位文案是「搜索文章标题、标签或**内容**…」，但 `renderPosts` 里的匹配源只有标题、摘要和标签：

```js
var haystack = (post.title + ' ' + post.excerpt + ' ' + post.tags.join(' ')).toLowerCase();
```

正文 `content` 完全没有参与搜索。用户按正文里的关键词搜索时会得到「没有找到匹配的文章」，与 UI 承诺不符。

**建议**：把正文文本也拼进 `haystack`（例如遍历 `post.content` 提取 `text` 与 `items`），或把占位文案改回「标题、摘要或标签」。

---

### 2. 🔴 快速排序最坏情况退化为 O(n²)、可能栈溢出（性能 / 健壮性）

**位置**：`js/sorting.js:37`

实现固定取区间首元素作为基准（`var pivot = a[low];`），且分区逻辑对已排序/逆序输入会退化为**最坏 O(n²)**，同时递归深度达到 n，输入较大（如上万）时会触发调用栈溢出。这是快速排序的经典问题，但本实现没有任何缓解措施。

**建议**：改用「三数取中」或随机基准；或对小区间切换到插入排序；也可改用迭代 + 显式栈。当前 demo 只测了 8 个随机元素，掩盖了这个问题。

---

### 3. 🟠 渲染列表块未校验 `block.items`（健壮性）

**位置**：`js/main.js:140-143`

`renderBlocks` 的 `list` 分支直接调用 `block.items.map(...)`，没有判断 `items` 是否存在。若将来某篇文章的 `list` 块漏写 `items` 字段，会抛 `TypeError` 并导致整页渲染中断。

**建议**：加空值保护，例如 `(block.items || []).map(...)`；同样的防御也可用于 `quote` 的 `text` 等字段。

---

### 4. 🟠 主题初始化脚本重复 3 份（可维护性）

**位置**：`index.html:8-15`、`about.html:7-13`、`post.html:7-13`

三页 `<head>` 内各有一段一模一样的主题预置脚本（读取 `localStorage` + 系统偏好 + 设置 `data-theme`）。改一处就得同步改三处，容易漏改。

**建议**：虽然为防闪烁（FOUC）放在 `<head>` 内联是合理的，但可把逻辑抽到单独的 `js/theme-init.js`，通过 `document.write`/同步脚本引用，或用构建手段注入，保持单一来源。

---

### 5. 🟠 `POSTS` 使用顶层 `var` 污染全局（可维护性）

**位置**：`js/posts.js:21`

`var POSTS = [...]` 在脚本顶层声明，会挂到 `window.POSTS`。`main.js` 也大量使用全局函数（`renderPosts`、`escapeHtml` 等），同一页面里靠加载顺序隐式共享，缺乏模块边界。

**建议**：至少在 `posts.js` 里用 IIFE 包裹并通过 `window.POSTS` 显式导出，或逐步迁移到 ES Module；`main.js` 同理。

---

### 6. 🟠 新增 `js/sorting.js` 未被页面引用（工程）

**位置**：`index.html:52-53` 等三页的脚本引入处

`dev` 分支新增了 `js/sorting.js`，但它只通过 `require.main === module` 在 Node 下自测，没有任何 HTML 页面 `<script>` 引入它，浏览器端完全用不到。属于「写了但没接入应用」的死代码。

**建议**：如果只想作为独立算法练习，建议把它放到独立目录（如 `algorithms/`）并在 README 说明；若想在页面展示，则需在对应页面引入并渲染结果。

---

### 7. 🟡 README 目录名与实际不一致（文档）

**位置**：`README.md:13`、`README.md:22`

README 写的是 `cd tech-blog`、目录树根节点是 `tech-blog/`，但实际仓库目录名是 `zjcgitdemo`。照抄 `cd tech-blog` 会直接失败。

**建议**：统一改成 `zjcgitdemo`，或改成与项目无关的通用描述（如「进入项目目录」）。

---

### 8. 🟡 README 目录结构未列出 `js/sorting.js`（文档）

**位置**：`README.md:21-31`

`dev` 分支新增了 `js/sorting.js`，但 README 的目录树仍只有 `posts.js` 和 `main.js`，文档与实际文件脱节。

**建议**：更新目录树，补充 `js/sorting.js` 及其用途说明。

---

### 9. 🟡 about.html / post.html 缺少 `meta description`（SEO）

**位置**：`about.html:3-15`、`post.html:3-15`

只有 `index.html` 有 `<meta name="description">`，另外两页没有。搜索摘要、社交分享卡片时描述会缺失。

**建议**：为两页补充各自合适的 `description`。

---

### 10. 🟡 可访问性：主题切换无状态语义、无减弱动效处理

**位置**：`index.html:25`、`js/main.js:30-47`、`style.css`（多处 `transition`）

- 切换按钮 `aria-label` 固定为「切换主题」，切换后不更新 `aria-pressed`，读屏用户无法得知当前主题状态。
- 全站多处 `transition`/`transform` 动画未配合 `@media (prefers-reduced-motion: reduce)` 关闭，对偏好减少动效的用户不够友好。

**建议**：切换后更新 `aria-pressed` 或 `aria-label`；添加 `prefers-reduced-motion` 降级。

---

### 11. 🟡 归并排序每层递归复制数组（性能）

**位置**：`js/sorting.js:62-64`

`mergeSort` 每层递归都执行 `arr.slice(...)`，对长度为 n 的数组累计分配约 O(n log n) 的临时空间与拷贝开销。功能正确，但对大数组不够高效。

**建议**：可改为一次分配辅助数组、通过下标区间原地归并，将空间降到 O(n)。

---

## 总结

整体代码结构清晰、注释规范、明暗主题与响应式处理得当，作为无框架演示项目质量不错。核心待改进点集中在：

1. **一处真实功能 Bug**（搜索范围与文案不符，见 #1）；
2. **排序算法的经典隐患**（快排最坏情况退化 + 未接入应用，见 #2、#6）；
3. **若干可维护性与文档一致性问题**（#4、#5、#7、#8）。

建议优先处理 #1 和 #2，其余可按需迭代。
