let funcs = {
  // 冒泡排序
  bubbleSort (arr) {
    // 使用一个两层的循环执行排序
    // 内层循环每执行一次，外层循环的指针 i 就向前进一步，表示前面的数据确认已经完成排序
    for (let i = 0; i < arr.length - 1; i++) {
      // 内层循环保证每次都能将最小的数据移到数组最左边
      for (let j = arr.length - 1; j > i; j--) {
        // 当前数据值比前一位的小，则将两个数据交换位置
        // 否则不进行操作，继续处理下一位的数据
        if (arr[j] < arr[j - 1]) {
          this.toolExch(arr, j - 1, j)
        }
      }
    }
    return arr
  },
  // 选择排序
  selectionSort (arr) {
    // 外层循环维护一个指针 i，每当内层循环完成一次交换，外层循环的指针就往前移一步
    // 指针移动到倒数第二个位置 arr.length - 2 时，结束循环
    for (let i = 0; i <= arr.length - 2; i++) {
      // index 维护了当前内循环中最小值的位置
      let index = i
      // 内层循环从指针 i 的位置往后查找最小的数据
      for (let j = i; j < arr.length; j++) {
        // 每当找到更小的数据，就更新 index
        if (arr[j] < arr[index]) index = j
      }
      // 将位置在 index 的最小数据与位置在 i 的当前指针互换位置
      this.toolExch(arr, index, i)
    }
    return arr
  },
  // 插入排序
  insertionSort (arr) {
    // 向右移动的外循环
    for (let i = 1; i < arr.length; i++) {
      // 声明内循环指针
      let j = i
      // 记录用于比较的当前数据
      let curr = arr[i]
      // 内循环，让当前数据一直向左移动
      // 直到遇到比当前数据小的值，或移动到数组左端为止
      while (j > 0 && arr[j - 1] > curr) {
        // 将更大的数据往右推
        arr[j] = arr[j - 1]
        // 指针左移
        j--
      }
      // 将当前数据插入到正确位置，使得 0~i 之间的数据有序
      arr[j] = curr
    }
    return arr
  },
  // 希尔排序
  shellSort (arr) {
    let len = arr.length
    let gap = 1
    while (gap < len / 3) {
      gap = gap * 3 + 1
    }
    while (gap >= 1) {
      for (let i = gap; i < len; i++) {
        let j = i
        let curr = arr[i]
        while (j >= gap && arr[j - gap] > curr) {
          arr[j] = arr[j - gap]
          j -= gap
        }
        arr[j] = curr
      }
      gap = (gap - 1) / 3
    }
    return arr
  },
  // 自顶向下的归并排序
  merge (arr) {
    // 递归的排序方法，接收数组、要排序的起始位置与结束位置
    let sort = (a, lo, hi) => {
      // 若 hi <= lo，则数组已经无法再分半，即为递归终点，则开始进行排序
      if (hi <= lo) return
      // 计算要排序数组的中间位置
      // mid 即为前半部分排序的终点
      // mid + 1 为后半部分排序的起点
      let mid = lo + Math.floor((hi - lo) / 2)
      // 分别对前后两半进行递归调用，直到无法再分半为止
      sort(a, lo, mid)
      sort(a, mid + 1, hi)
      // 对数组前后两半执行归并
      this.toolMerge(a, lo, mid, hi)
    }
    sort(arr, 0, arr.length - 1)
    return arr
  },
  // 自底向上的归并排序
  mergeBU (arr) {
    // 获取数组长度
    let len = arr.length
    // 外层循环维护一个归并的单位大小 sz
    // 因为总是进行对半拆分，所以它每次进行归并的数组应该扩大为 2 倍，即每次递增操作为 sz *= 2
    for (let sz = 1; sz < len; sz *= 2) {
      // 内循环维护了每次归并的数组的起始位置 lo
      // 结束条件的解释是：lo + sz 指进行归并数组的前一半长度，若 lo + sz 的右边已经没有数据可供归并，则循环可以结束
      // 内循环每次执行归并的数组大小为 sz * 2，因此每次递增增加 sz * 2
      for (let lo = 0; lo < len - sz; lo += sz * 2) {
        // 对当前操作的数组执行归并
        // 起始点为 lo，中间位置为 lo + sz - 1
        // 结束位置若数组末端的下标更小，则需取数组末端的位置，以结束整个数组的归并
        this.toolMerge(arr, lo, lo + sz - 1, Math.min(lo + sz * 2 - 1, len - 1))
      }
    }
    return arr
  },
  // 使用辅助数组进行拆分，实现非常简单
  qSort (arr) {
    if (arr.length === 0) { return [] }
    // 声明辅助数组，保存比 pivot 小及比 pivot 大的数据
    // 声明 pivot，这里为了方便直接取数组的第一个值
    // 事实上，pivot 可以为被排序数组中任意的值，且如何对它进行取值会影响算法最终的性能
    let lesser = [], greater = [], pivot = arr[0]
    // 遍历数组，将小于 pivot 的数据放入 lesser中
    // 大于 pivot 的数据放入 greater 中
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
        lesser.push(arr[i])
      } else {
        greater.push(arr[i])
      }
    }
    // 最终输出 [...小于 pivot 的数据集合, pivot, ...大于 pivot 的数据集合]
    // 并对被切分后的左右数组分别进行递归调用，以输出有序的左右数组
    // 因此在所有递归完成后，整个数组就会有序
    return this.qSort(lesser).concat(pivot, this.qSort(greater))
  },
  // 使用交换前后数组元素的方式切分，操作的次数更少
  qSortOptimizeSegmentation (arr) {
    let partition = (a, lo, hi) => {
      let i = lo, j = hi + 1, v = a[lo]
      while (true) {
        while (a[++i] < v) { if (i === hi) { break } }
        while (a[--j] > v) { if (j === lo) { break } }
        if (i >= j) { break }
        this.toolExch(a, i, j)
      }
      this.toolExch(a, lo, j)
      return j
    }
    let qs = (a, lo, hi) => {
      if (lo >= hi) { return }
      let j = partition(a, lo, hi)
      qs(a, lo, j - 1)
      qs(a, j + 1, hi)
    }
    qs(arr, 0, arr.length - 1)
    return arr
  },
  // 对大小小于 10 (5-15均可) 的数据集进行插入排序，优化小数据集的排序速度
  qSortOptimizeSmallDataSet (arr) {
    let partition = (a, lo, hi) => {
      let i = lo, j = hi + 1, v = a[lo]
      while (true) {
        while (a[++i] < v) { if (i === hi) { break } }
        while (a[--j] > v) { if (j === lo) { break } }
        if (i >= j) { break }
        this.toolExch(a, i, j)
      }
      this.toolExch(a, lo, j)
      return j
    }
    let qs = (a, lo, hi) => {
      if (hi <= lo + 10) { a = this.toolInsertionSort(a, lo, hi); return }
      let j = partition(a, lo, hi)
      qs(a, lo, j - 1)
      qs(a, j + 1, hi)
    }
    qs(arr, 0, arr.length - 1)
    return arr
  },
  // 使用三向切分优化它在应对大量重复数据时的效率
  qSortThreeWayPartition (arr) {
    let qs = (a, lo, hi) => {
      if (hi <= lo + 10) { a = this.toolInsertionSort(a, lo, hi); return }
      // 三向切分把等于切分点的数据都移到中间，避免了所有等于切分点的数据重复排序
      let lt = lo
      let i = lo + 1
      let gt = hi
      let v = a[lo]
      while (i <= gt) {
        if (a[i] < v) { this.toolExch(a, lt++, i++) }
        else if (a[i] > v) { this.toolExch(a, i, gt--) }
        else { i++ }
      }
      qs(a, lo, lt - 1)
      qs(a, gt + 1, hi)
    }
    qs(arr, 0, arr.length - 1)
    return arr
  },
  // tool
  // 原地归并
  toolMerge (a, lo, mid, hi) {
    let i = lo
    let j = mid + 1
    let temp = []
    for (let k = lo; k <= hi; k++) temp[k] = a[k]
    for (let k = lo; k <= hi; k++) {
      if (i > mid) { a[k] = temp[j++] }
      else if (j > hi) { a[k] = temp[i++] }
      else if (temp[i] >= temp[j]) { a[k] = temp[j++] }
      else if (temp[i] < temp[j]) { a[k] = temp[i++] }
    }
  },
  // 在指定范围内排序的插入排序
  toolInsertionSort (arr, lo, hi) {
    for (let i = lo; i < hi + 1; i++) {
      let j = i
      let curr = arr[i]
      while (j > lo && arr[j - 1] > curr) {
        arr[j] = arr[j - 1]
        j--
      }
      arr[j] = curr
    }
    return arr
  },
  // 交换数组元素
  toolExch (a, lo, hi) { let temp = a[lo]; a[lo] = a[hi]; a[hi] = temp }
}

let arr = Array.from({ length: 10 }, v => Math.floor(Math.random() * 100))
for (let key in funcs) {
  if (!key.indexOf('tool')) { continue }
  let temp = Array.from(arr)
  console.time(key)
  // funcs[key](temp) // 测时间
  console.log(funcs[key](temp)) // 测输出
  console.timeEnd(key)
}