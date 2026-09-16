/* ============================================
   三种经典排序算法：冒泡排序、快速排序、归并排序
   可在 Node 环境下直接运行：node algorithms/sorting.js
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
// 优化：三数取中选择基准，避免已排序/逆序输入退化为 O(n^2)；
//       小区间改用插入排序，减少递归开销。
function quickSort(arr) {
  var a = arr.slice();
  var THRESHOLD = 16;

  // 对 [low, high] 区间做插入排序（小区间更高效）
  function insertionSort(low, high) {
    for (var i = low + 1; i <= high; i++) {
      var key = a[i];
      var j = i - 1;
      while (j >= low && a[j] > key) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
    }
  }

  // 三数取中：取首、中、尾三个元素的中位数作为基准，放到区间首位
  function medianOfThree(low, high) {
    var mid = low + ((high - low) >> 1);
    if (a[low] > a[mid]) swap(a, low, mid);
    if (a[low] > a[high]) swap(a, low, high);
    if (a[mid] > a[high]) swap(a, mid, high);
    swap(a, mid, low);
    return a[low];
  }

  function sort(low, high) {
    if (high - low + 1 <= THRESHOLD) {
      insertionSort(low, high);
      return;
    }
    var pivot = medianOfThree(low, high);
    var left = low;
    var right = high;
    while (left < right) {
      while (left < right && a[right] >= pivot) right--;
      a[left] = a[right];
      while (left < right && a[left] <= pivot) left++;
      a[right] = a[left];
    }
    a[left] = pivot;       // 基准归位
    sort(low, left - 1);   // 递归排序左半区
    sort(left + 1, high);  // 递归排序右半区
  }

  sort(0, a.length - 1);
  return a;
}

/* ---------- 3. 归并排序 ---------- */
// 分治：把数组不断对半拆分，再两两合并成有序序列。
// 时间复杂度：O(n log n)，稳定排序。
// 优化：用一次分配的辅助数组 + 下标区间做原地归并，空间从 O(n log n) 降到 O(n)。
function mergeSort(arr) {
  var a = arr.slice();
  var aux = a.slice();

  function merge(low, mid, high) {
    for (var k = low; k <= high; k++) aux[k] = a[k];
    var i = low;
    var j = mid + 1;
    for (var k = low; k <= high; k++) {
      if (i > mid) a[k] = aux[j++];
      else if (j > high) a[k] = aux[i++];
      else if (aux[i] <= aux[j]) a[k] = aux[i++];
      else a[k] = aux[j++];
    }
  }

  function sort(low, high) {
    if (low >= high) return;
    var mid = Math.floor((low + high) / 2);
    sort(low, mid);
    sort(mid + 1, high);
    merge(low, mid, high);
  }

  sort(0, a.length - 1);
  return a;
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

  // 针对已排序 / 逆序 / 大数组的健壮性校验（回归 issues #2、#11）
  var sorted = [];
  var reversed = [];
  var big = [];
  for (var i = 0; i < 10000; i++) {
    sorted.push(i);
    reversed.push(10000 - i);
    big.push(Math.floor(Math.random() * 100000));
  }
  function check(name, input) {
    var want = input.slice().sort(function (x, y) { return x - y; });
    var pass =
      JSON.stringify(quickSort(input)) === JSON.stringify(want) &&
      JSON.stringify(mergeSort(input)) === JSON.stringify(want);
    console.log((pass ? '✓ ' : '✗ ') + name + '（长度 ' + input.length + '）');
  }
  check('已排序数组', sorted);
  check('逆序数组', reversed);
  check('随机大数组', big);
}

// 仅在 Node 环境直接运行时执行演示（避免在浏览器中被无谓调用）
if (typeof module !== 'undefined' && require.main === module) {
  demo();
}
