/* ============================================
   三种经典排序算法：冒泡排序、快速排序、归并排序
   可在 Node 环境下直接运行：node js/sorting.js
   ============================================ */

/* ---------- 工具函数 ---------- */
// 交换数组中两个位置的元素
function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

/* ---------- 1. 冒泡排序 ---------- */
// 相邻元素两两比较，把较大的元素依次“冒泡”到数组末尾。
// 时间复杂度：O(n^2)，稳定排序。
function bubbleSort(arr) {
  var a = arr.slice(); // 拷贝一份，避免修改原数组
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    var swapped = false; // 提前退出：本轮没有交换则已有序
    for (var j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        swap(a, j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}

/* ---------- 2. 快速排序 ---------- */
// 选取基准值，把小于基准的放左边、大于基准的放右边，再递归排序两侧。
// 平均时间复杂度：O(n log n)，不稳定排序。
function quickSort(arr) {
  var a = arr.slice();
  function sort(low, high) {
    if (low >= high) return;
    var pivot = a[low];          // 以区间第一个元素为基准
    var left = low;
    var right = high;
    while (left < right) {
      // 从右往左找第一个小于基准的元素
      while (left < right && a[right] >= pivot) right--;
      a[left] = a[right];
      // 从左往右找第一个大于基准的元素
      while (left < right && a[left] <= pivot) left++;
      a[right] = a[left];
    }
    a[left] = pivot;             // 基准归位
    sort(low, left - 1);         // 递归排序左半区
    sort(left + 1, high);        // 递归排序右半区
  }
  sort(0, a.length - 1);
  return a;
}

/* ---------- 3. 归并排序 ---------- */
// 分治：把数组不断对半拆分，再两两合并成有序序列。
// 时间复杂度：O(n log n)，稳定排序，需要额外 O(n) 空间。
function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();

  var mid = Math.floor(arr.length / 2);
  var left = mergeSort(arr.slice(0, mid));
  var right = mergeSort(arr.slice(mid));

  // 合并两个有序数组
  var result = [];
  var i = 0;
  var j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

/* ---------- 演示与自测 ---------- */
function demo() {
  var original = [64, 34, 25, 12, 22, 11, 90, 5];

  console.log('原始数组：', original);
  console.log('冒泡排序：', bubbleSort(original));
  console.log('快速排序：', quickSort(original));
  console.log('归并排序：', mergeSort(original));

  // 简单正确性校验
  var expected = original.slice().sort(function (x, y) { return x - y; });
  var ok =
    JSON.stringify(bubbleSort(original)) === JSON.stringify(expected) &&
    JSON.stringify(quickSort(original)) === JSON.stringify(expected) &&
    JSON.stringify(mergeSort(original)) === JSON.stringify(expected);
  console.log(ok ? '✓ 三种排序结果均正确' : '✗ 排序结果有误');
}

// 仅在 Node 环境直接运行时执行演示（避免在浏览器中被无谓调用）
if (typeof module !== 'undefined' && require.main === module) {
  demo();
}
