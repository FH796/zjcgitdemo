/* ============================================
   主题初始化：在渲染前设置 data-theme，避免闪烁（FOUC）
   通过 <head> 内的同步脚本引入，须在 CSS 加载前执行
   ============================================ */
(function () {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
