/* ============================================
   主逻辑：主题切换、列表渲染、搜索筛选、详情渲染
   ============================================ */

/* ---------- 工具函数 ---------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 渲染行内文本，把 `code` 转为 <code>
function renderInline(text) {
  var escaped = escapeHtml(text);
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

// 根据文章内容估算阅读时长（分钟）
function readTime(post) {
  var chars = 0;
  post.content.forEach(function (block) {
    if (block.text) chars += block.text.length;
    if (block.items) block.items.forEach(function (i) { chars += i.length; });
  });
  return Math.max(1, Math.round(chars / 400));
}

// 汇总文章所有可搜索文本（标题 / 摘要 / 标签 / 正文）
function searchText(post) {
  var parts = [post.title, post.excerpt].concat(post.tags);
  post.content.forEach(function (block) {
    if (block.text) parts.push(block.text);
    if (block.items) parts = parts.concat(block.items);
  });
  return parts.join(' ').toLowerCase();
}

/* ---------- 主题切换 ---------- */
function initTheme() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function refreshIcon() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = dark ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? '切换到亮色主题' : '切换到暗色主题');
  }

  refreshIcon();
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    refreshIcon();
  });
}

/* ---------- 首页：分类筛选 + 文章列表 + 搜索 ---------- */
function renderCategories() {
  var container = document.getElementById('category-filter');
  if (!container) return;

  var categories = ['全部'];
  POSTS.forEach(function (p) {
    if (categories.indexOf(p.category) === -1) categories.push(p.category);
  });

  container.innerHTML = categories.map(function (c, i) {
    return '<button class="chip' + (i === 0 ? ' active' : '') + '" data-category="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
  }).join('');
}

function cardHtml(post) {
  return (
    '<article class="post-card">' +
      '<div class="card-meta">' +
        '<span class="card-category">' + escapeHtml(post.category) + '</span>' +
        '<span>' + escapeHtml(post.date) + ' · ' + readTime(post) + ' 分钟</span>' +
      '</div>' +
      '<h2><a href="post.html?id=' + encodeURIComponent(post.id) + '">' + escapeHtml(post.title) + '</a></h2>' +
      '<p class="card-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      '<div class="card-tags">' + post.tags.map(function (t) {
        return '<span class="tag">#' + escapeHtml(t) + '</span>';
      }).join('') + '</div>' +
    '</article>'
  );
}

function renderPosts(filter) {
  var list = document.getElementById('post-list');
  var emptyTip = document.getElementById('empty-tip');
  if (!list) return;

  filter = filter || { keyword: '', category: '全部' };

  var result = POSTS.filter(function (post) {
    // 分类匹配
    if (filter.category !== '全部' && post.category !== filter.category) return false;
    // 关键词匹配（标题 / 摘要 / 标签）
    if (filter.keyword) {
      var kw = filter.keyword.toLowerCase();
      if (searchText(post).indexOf(kw) === -1) return false;
    }
    return true;
  });

  list.innerHTML = result.map(cardHtml).join('');
  if (emptyTip) emptyTip.hidden = result.length > 0;
}

function setupFilters() {
  var filterBox = document.getElementById('category-filter');
  var searchInput = document.getElementById('search-input');
  var state = { keyword: '', category: '全部' };

  if (filterBox) {
    filterBox.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      state.category = chip.getAttribute('data-category');
      filterBox.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('active', c === chip);
      });
      renderPosts(state);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.keyword = searchInput.value.trim();
      renderPosts(state);
    });
  }
}

/* ---------- 文章详情页 ---------- */
function renderBlocks(blocks) {
  return blocks.map(function (block) {
    switch (block.type) {
      case 'h2':
        return '<h2>' + renderInline(block.text) + '</h2>';
      case 'h3':
        return '<h3>' + renderInline(block.text) + '</h3>';
      case 'p':
        return '<p>' + renderInline(block.text) + '</p>';
      case 'quote':
        return '<blockquote><p>' + renderInline(block.text) + '</p></blockquote>';
      case 'list':
        return '<ul>' + (block.items || []).map(function (i) {
          return '<li>' + renderInline(i) + '</li>';
        }).join('') + '</ul>';
      case 'code':
        var label = block.lang ? '<span class="code-lang">' + escapeHtml(block.lang) + '</span>' : '';
        return '<pre class="code-block">' + label + '<code>' + escapeHtml(block.text) + '</code></pre>';
      default:
        return '';
    }
  }).join('');
}

function renderPost() {
  var container = document.getElementById('post-content');
  var emptyTip = document.getElementById('empty-tip');
  if (!container) return;

  var id = new URLSearchParams(window.location.search).get('id');
  var post = POSTS.filter(function (p) { return p.id === id; })[0];

  if (!post) {
    if (emptyTip) emptyTip.hidden = false;
    return;
  }

  document.title = post.title + ' - 我的技术博客';

  var tags = post.tags.map(function (t) {
    return '<span class="tag">#' + escapeHtml(t) + '</span>';
  }).join('');

  container.innerHTML =
    '<header class="article-header">' +
      '<h1>' + escapeHtml(post.title) + '</h1>' +
      '<div class="article-meta">' +
        '<span class="category">' + escapeHtml(post.category) + '</span>' +
        '<span>' + escapeHtml(post.date) + '</span>' +
        '<span>阅读约 ' + readTime(post) + ' 分钟</span>' +
      '</div>' +
      '<div class="card-tags" style="margin-top:12px">' + tags + '</div>' +
    '</header>' +
    '<div class="article-body">' + renderBlocks(post.content) + '</div>';
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initTheme();

  var isPostPage = !!document.getElementById('post-content');
  var isListPage = !!document.getElementById('post-list');

  if (isPostPage) {
    renderPost();
  }

  if (isListPage) {
    renderCategories();
    renderPosts();
    setupFilters();
  }
});
