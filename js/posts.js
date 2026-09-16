/* ============================================
   文章数据
   --------------------------------------------
   添加新文章：在 POSTS 数组里追加一个对象即可。

   字段说明：
   - id        唯一标识（用于 URL 跳转，用英文短横线）
   - title     标题
   - date      发布日期
   - category  分类
   - tags      标签数组
   - excerpt   摘要（首页卡片显示）
   - content   正文，由「块」组成的数组，支持的类型：
       { type: 'h2'|'h3', text: '...' }            标题
       { type: 'p',   text: '...' }                段落（用 ` 包裹表示行内代码）
       { type: 'list', items: ['...','...'] }      无序列表
       { type: 'quote', text: '...' }              引用
       { type: 'code', lang: 'js', text: '...' }   代码块
   ============================================ */

// 显式挂载到 window，供页面脚本（main.js）共享；
// 避免用顶层 var 隐式污染全局命名空间
window.POSTS = [
  {
    id: 'build-blog',
    title: '从零搭建一个纯 HTML + CSS + JS 的个人博客',
    date: '2026-09-10',
    category: '前端开发',
    tags: ['HTML', 'CSS', 'JavaScript', '博客'],
    excerpt: '不依赖任何框架与构建工具，只用原生三件套搭建一个轻量、易维护的个人技术博客。',
    content: [
      { type: 'p', text: '很多人在搭建个人博客时，第一反应是选择 Hexo、VuePress 或者 Next.js 这类工具。它们功能强大，但对于一个只想快速上线、随时写点东西的博客来说，往往显得过重。其实用最原始的三件套——HTML、CSS、JavaScript——就完全够用。' },
      { type: 'h2', text: '为什么选择纯静态三件套' },
      { type: 'p', text: '原生方案没有依赖、没有构建步骤，打开浏览器就能跑。你只需要一个能托管静态文件的空间（GitHub Pages、Vercel 都行），甚至直接双击 `index.html` 也能预览。' },
      { type: 'list', items: [
        '零依赖：不需要 `npm install`，没有 node_modules',
        '上手快：无需学习任何框架 API',
        '足够快：静态文件加载极快，几乎没有性能瓶颈',
        '易维护：结构清晰，改样式改逻辑一目了然'
      ] },
      { type: 'h2', text: '整体结构' },
      { type: 'p', text: '一个博客最核心的诉求就是「读文章」。所以只需要三个页面：首页（文章列表）、文章详情页、关于页。文章内容统一放在一个 `posts.js` 里，用结构化数据来描述，这样以后写新文章时，只改这一个文件。' },
      { type: 'code', lang: 'text', text: 'tech-blog/\n├── index.html      # 首页\n├── post.html       # 文章详情页\n├── about.html      # 关于页\n├── css/\n│   └── style.css   # 样式\n└── js/\n    ├── posts.js    # 文章数据\n    └── main.js     # 渲染逻辑' },
      { type: 'h2', text: '文章如何存储' },
      { type: 'p', text: '我们把一篇文章拆成一个个「块」，用数组表示。段落、标题、代码块、列表都是独立的块，渲染时逐个转成对应的 HTML 标签。这样做的好处是：不需要手写 HTML，也不用引入 Markdown 解析器。' },
      { type: 'code', lang: 'js', text: 'var POSTS = [\n  {\n    id: "build-blog",\n    title: "从零搭建一个纯 HTML + CSS + JS 的个人博客",\n    date: "2026-09-10",\n    category: "前端开发",\n    tags: ["HTML", "CSS"],\n    excerpt: "一句话简介",\n    content: [\n      { type: "h2", text: "小节标题" },\n      { type: "p", text: "正文段落" }\n    ]\n  }\n];' },
      { type: 'h3', text: '渲染逻辑' },
      { type: 'p', text: '用一个 `renderBlocks` 函数遍历这些块，根据 `type` 输出对应的标签。行内代码用反引号 ` ` ` 包裹，渲染时替换成 `<code>`。' },
      { type: 'h2', text: '几个让体验更好的细节' },
      { type: 'list', items: [
        '明暗主题切换：用 CSS 变量定义颜色，切换时只改一个属性',
        '搜索与分类筛选：在首页用原生 JS 过滤文章数组',
        '响应式布局：卡片用 Grid 自适应，手机端自动变成单列'
      ] },
      { type: 'quote', text: '简单不等于简陋。用对工具，原生三件套也能做出好用的产品。' },
      { type: 'h2', text: '总结' },
      { type: 'p', text: '搭建一个博客并不难，难的是坚持写下去。选择一个低成本的方案，把精力留给内容本身，往往能走得更远。' }
    ]
  },

  {
    id: 'js-closures',
    title: 'JavaScript 闭包完全指南',
    date: '2026-08-28',
    category: 'JavaScript',
    tags: ['闭包', '作用域', '基础'],
    excerpt: '闭包是 JavaScript 中最重要也最容易被误解的概念之一。本文用通俗的例子把它彻底讲清楚。',
    content: [
      { type: 'p', text: '闭包（Closure）是 JavaScript 面试和日常开发中都绕不开的概念。简单来说：闭包就是「一个函数能够记住并访问它定义时所在的词法作用域，即使这个函数在其作用域之外被执行」。' },
      { type: 'h2', text: '一个最经典的例子' },
      { type: 'code', lang: 'js', text: 'function createCounter() {\n  var count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nvar counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3' },
      { type: 'p', text: '`createCounter` 执行完毕后，按理说局部变量 `count` 应该被销毁了。但内部返回的函数仍然引用着它，所以 `count` 被保留了下来，并且每次调用都在同一个 `count` 上累加。这个「被保留住的作用域」就是闭包。' },
      { type: 'h2', text: '为什么会这样' },
      { type: 'p', text: '关键在于 JavaScript 采用的是「词法作用域」：函数的作用域在定义时就确定了，而不是在调用时。内部函数定义在 `createCounter` 里，所以它能访问 `count`；只要这个内部函数还有被引用的可能，`count` 就不会被垃圾回收。' },
      { type: 'h2', text: '经典陷阱：循环里的 var' },
      { type: 'p', text: '下面这段代码是一个著名的坑，很多人以为会输出 0、1、2，结果却全是 3。' },
      { type: 'code', lang: 'js', text: 'for (var i = 0; i < 3; i++) {\n  setTimeout(function () {\n    console.log(i);\n  }, 100);\n}\n// 输出：3 3 3' },
      { type: 'p', text: '原因在于 `var` 声明的 `i` 是函数级作用域，循环结束后 `i` 已经变成了 3，而三个回调函数引用的都是同一个 `i`。解决方法有两个：用 `let` 让每次循环都生成独立的块级作用域，或者用 IIFE 包一层。' },
      { type: 'code', lang: 'js', text: '// 方案一：使用 let\nfor (let i = 0; i < 3; i++) {\n  setTimeout(function () { console.log(i); }, 100);\n}\n// 输出：0 1 2\n\n// 方案二：IIFE 立即执行函数\nfor (var i = 0; i < 3; i++) {\n  (function (j) {\n    setTimeout(function () { console.log(j); }, 100);\n  })(i);\n}\n// 输出：0 1 2' },
      { type: 'h2', text: '闭包的实际用途' },
      { type: 'list', items: [
        '数据私有化：模拟私有变量，外部无法直接访问',
        '函数工厂：动态生成一系列行为类似的函数',
        '柯里化与偏函数：提前固定部分参数',
        '事件回调与防抖节流：保留状态'
      ] },
      { type: 'h2', text: '小结' },
      { type: 'p', text: '理解闭包的关键是理解「词法作用域」和「垃圾回收」两件事。一旦想明白「变量为什么没被销毁」，闭包就不再神秘了。' }
    ]
  },

  {
    id: 'css-grid-flexbox',
    title: 'CSS Grid 与 Flexbox：到底该怎么选',
    date: '2026-08-15',
    category: 'CSS',
    tags: ['Grid', 'Flexbox', '布局'],
    excerpt: 'Grid 和 Flexbox 都能做布局，但它们的定位并不相同。掌握各自的适用场景，布局就不纠结了。',
    content: [
      { type: 'p', text: 'Flexbox 和 Grid 是现在 CSS 布局的两大支柱。新手最常见的困惑是：两个都能排布元素，我该用哪个？答案是——它们解决的不是同一个问题。' },
      { type: 'h2', text: '一句话区分' },
      { type: 'quote', text: 'Flexbox 是「一维」布局，适合在一条轴（行或列）上排布元素；Grid 是「二维」布局，适合同时控制行与列。' },
      { type: 'h2', text: 'Flexbox：一维布局' },
      { type: 'p', text: 'Flexbox 擅长处理「一行内元素如何分布」的问题：导航栏、按钮组、卡片内标题与操作按钮的对齐，都是典型的 Flex 场景。' },
      { type: 'code', lang: 'css', text: '.navbar {\n  display: flex;\n  justify-content: space-between; /* 两端对齐 */\n  align-items: center;           /* 垂直居中 */\n  gap: 16px;\n}' },
      { type: 'h2', text: 'Grid：二维布局' },
      { type: 'p', text: '当布局需要同时确定「几行几列、每个元素占哪个格子」时，Grid 更合适，比如整个页面的骨架、图片画廊、复杂的仪表盘。' },
      { type: 'code', lang: 'css', text: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 三列等宽 */\n  gap: 16px;\n}\n\n.featured {\n  grid-column: span 2; /* 占两列 */\n}' },
      { type: 'h2', text: '选择建议' },
      { type: 'list', items: [
        '只需在一个方向排布（行或列）→ 用 Flexbox',
        '需要同时控制行和列，或元素要跨行跨列 → 用 Grid',
        '整体页面骨架用 Grid，局部组件内部用 Flexbox',
        '两者可以嵌套使用，并不冲突'
      ] },
      { type: 'h2', text: '小结' },
      { type: 'p', text: '不要把 Flexbox 和 Grid 当成竞争对手，它们更像一对搭档。记住「一维用 Flex，二维用 Grid」这条原则，绝大多数布局都能快速找到正确解法。' }
    ]
  },

  {
    id: 'git-workflow',
    title: '高效 Git 工作流实践：分支与提交规范',
    date: '2026-07-30',
    category: '工程效率',
    tags: ['Git', '工作流', '规范'],
    excerpt: '一套清晰的分支策略和提交信息规范，能让团队的协作效率和代码历史质量都上一个台阶。',
    content: [
      { type: 'p', text: 'Git 人人都会用，但「用得好」的人不多。真正拉开差距的，往往不是命令记得多少，而是有没有一套清晰的工作流和规范。' },
      { type: 'h2', text: '分支策略' },
      { type: 'p', text: '小团队里，一个简单有效的做法是「主干 + 特性分支」模型：`main` 分支始终可发布，任何新功能或修复都从 `main` 拉出一个短命分支，完成后合回。' },
      { type: 'code', lang: 'text', text: 'main                # 主分支，始终稳定\n  ├── feature/login  # 功能分支\n  ├── feature/pay    # 功能分支\n  └── fix/typo       # 修复分支' },
      { type: 'list', items: [
        '分支命名用 `类型/描述`：feature、fix、docs、refactor',
        '一个分支只做一件事，做完及时合并',
        '合并前先同步 `main`，避免积累冲突'
      ] },
      { type: 'h2', text: '提交信息规范' },
      { type: 'p', text: '一条好的提交信息要能回答「为什么改」，而不只是「改了什么」。业界流行的 Conventional Commits 规范值得借鉴。' },
      { type: 'code', lang: 'text', text: 'feat: 新增用户登录功能\nfix: 修复分页在空数据时的崩溃\nrefactor: 抽取表单校验逻辑为公共函数\ndocs: 更新 README 部署说明' },
      { type: 'h2', text: '几个实用的技巧' },
      { type: 'list', items: [
        '频繁提交小改动，比一次性提交大量代码更容易回溯',
        '用 `git add -p` 把无关改动拆成多个提交',
        '合并前用 `git rebase` 让历史更线性清晰',
        '定期清理已合并的本地分支'
      ] },
      { type: 'h2', text: '小结' },
      { type: 'p', text: '规范和流程的本质是降低协作成本。约定一旦建立并坚持执行，团队的工作效率会明显提升。' }
    ]
  }
];
