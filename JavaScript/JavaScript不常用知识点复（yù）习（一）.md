为了巩固JavaScript基础知识，重读了《JavaScript高级编程》一书，归纳总结了一些在平常编程中比较少用到的知识点（尤其是浏览器端编程），第一部分主要总结前五章的内容，包括基本概念、变量、作用域、内存及引用类型相关的问题。

## 1. 基本概念

### 1. `<script>`标签的`asnyc`与`defer`

![](https://user-gold-cdn.xitu.io/2019/1/4/16818e5ed41a6108?w=689&h=112&f=jpeg&s=32256)

这是`async`与`defer`在页面渲染时的时序图，蓝色线代表网络读取，红色线代表执行时间，这俩都是针对脚本的；绿色线代表`HTML`解析。

也就是说`async`是乱序的，而`defer`是顺序执行，这也就决定了`async`比较适用于百度分析或者谷歌分析这类不依赖其他脚本的库。从图中可以看到一个普通的`<script>`标签的加载和解析都是同步的，会阻塞`DOM`的渲染，这也就是我们经常会把`<script>`写在`<body>`底部的原因之一，为了防止加载资源而导致的长时间的白屏，另一个原因是js可能会进行`DOM`操作，所以要在`DOM`全部渲染完后再执行。

### 2. 所有数据类型的值都有与`true`和`false`等价的值

数据类型 | 转换为true的值 | 转换为false的值
---|---|---
Boolean | true | true
String | 任何非空字符串 | 空字符串
Number | 任何非零数字值（包括无穷大） | 0和NaN
Object | 任何对象 | null
Undefined | n/a | undefined

初始化变量时应赋予这里的转换为`false`的值，如初始化一个对象，则使用`var obj = null`，这样方便判断变量为空的状况，有利于对`JavaScript`这种弱类型语言的类型管理。

### 3. 数字的无穷值Infinity
`js`中的最大数字保存在`Number.MAX_VALUE`中，最小数值保存在`Number.MIN_VALUE`中，`Infinity`不能参与计算，使用`isFinite()`方法判断数字是否为无穷。

### 4. 关系操作符`<`、`>`、`>=`、`<=`判断字符串
判断字符串的大小，取决于第一个字符的字符编号，这可以应用到英文字母的位置判断上（必须统一转为大写或小写，可应用于按字母排序）
```js
var result = 'Brick'.toLowerCase() > 'alphabet'.toLowerCase() // true
```
判断得到`b`在字母表中的位置在`a`的后面

### 5. `for-in`循环
`ECMAScript`的对象属性没有顺序，因此，通过`for-in`循环输出的属性名顺序理论上是不可预测的，返回的先后次序可能会因浏览器而异。

### 6. `for`循环的`label`
用于给`for`循环做标记，使其可以对指定的循环进行`break`或`continue`操作
```js
var a = 1;
label : for ( var i = 0; i < 5; i++ ) {
    for ( var j = 0; j < 5; j++ ) {
        if ( i == 3 ) {
            break label;
        }
        a++;
    }
}
console.log( a ); // 16
// 此时break跳出了指定的外部循环，整个循环嵌套结束，因此只执行了三次内部循环，+5+5+5结果为16
var a = 1;
for ( var i = 0; i < 5; i++ ) {
    for ( var j = 0; j < 5; j++ ) {
        if ( i == 3 ) {
            break;
        }
        a++;
    }
}
console.log( a ); // 21
// 此时没有指定label，break跳出的是内部循环，即跳过了一次当i=3时的外部循环，因此总共执行了5-1=4次内部循环，+5+5+5+5结果为21
```

### 7. `switch`
`switch`语句在比较值时使用的是全等操作符，因此不会发生类型转换。

### 8. 函数
1. 在函数内部可以通过`arguments[0]`，`arguments[1]`来访问函数的参数，`arguments`是一个类数组对象（不是`Array`的实例）
2. 使用`arguments.length`判断参数长度常用于方法封装，如：

```js
function doSth () {
    if (arguments.length === 1) {
        alert(arguments[0])
    } else if (arguments.length === 2) {
        alert(arguments[0], arguments[1])
    }
}
```

> 换一种说法：通过检查传入函数中的参数类型和数量并做出不同的反应，可以模拟方法的重载（Java等语言中可以为函数编写两个定义，只要这两个定义的签名——接受的参数的类型和数量不同即可，这种函数调用的方式称为函数重载）。

## 2. 变量、作用域、内存
### 1. 变量赋值
变量赋值中的参数传递只有按值传递，引用类型赋值时传递的是内存指针，由内存指针指向内存栈中的值，仍然是按值传递，参考下面例子：

```js
function setName (obj) {
    obj.name = 'Nicholas'
    obj = new Object()
    obj.name = 'Greg'
}
var person = new Object()
setName(person)
alert(person.name) // Nicholas
```

由于在函数内对参数`obj`创建了新对象，`obj`拥有了新的内存地址（这是函数块中的局部变量），因此后面对对象的修改是针对新的内存地址中存储的对象做的，所以原来传进来的参数`obj`所指向的对象不会被修改，因此`obj.name`会返回未声明新内存指针时赋值的结果`Nicholas`。

### 2. 函数参数的作用域
函数的参数被当做变量来对待，因此其访问规则与执行环境中的其他变量相同（函数参数相当于函数内的局部变量）。

### 3. 垃圾回收策略
1. 标记清除

先将内存中所有变量进行标记；然后清除`作用域`中的变量以及被`作用域`中变量引用的变量的标记；把剩下的标记视为待清除的变量；执行清除——销毁标记并回收内存。

2. 引用计数

引用计数通过跟踪每个变量被引用的次数，等待某个变量的引用次数为0了，再执行清除。这会导致`循环引用`的问题：

```js
function problem () {
    var objA = new Object()
    var objB = new Object()
    
    objA.someOtherObject = objB
    objB.anotherObject = objA
}
```
这里`objA`与`objB`通过自身的属性相互引用，其引用次数始终为2，因此在引用计数的策略下这两个变量的内存始终得不到回收，导致性能下降甚至崩溃。

> 在IE9以下的IE版本中，BOM对象和DOM对象并不是原生的JavaScript对象，而是用C++通过COM对象(Component Model Object组件模型对象)的形式实现的，而COM就是使用引用计数进行垃圾清除的，因此在这些版本中，若发生DOM或BOM对象与原生JavaScript对象互相引用的情况，也会出现循环引用的问题：

```js
var element = document.getElementById('some_element')
var myObject = new Object()
myObject.element = element
element.someObject = myObject
```

> 上例中，一个DOM元素与一个原生JavaScript对象产生了循环引用，此时就算DOM节点从html上移除，DOM对象也会一直存在与内存中

3. 性能问题

IE的垃圾回收频率是通过内存分配量来界定的，当内存占用超过某个临界值就会触发回收，IE7之前，这个临界值是固定的（256个变量、4096个对象字面量和数组元素或者64kb的字符串），但是如果一个程序拥有这么多变量，那他变量的内存占比一定会长期保持在这样的高水平，因此会不断触发垃圾回收，导致性能爆炸。IE7对此进行了优化，根据内存占比动态设定临界值。

4. 解除引用

全局变量在使用后应尽量通过手动方式解除引用，避免无谓占用内存。

```js
// 解除引用
var asd = { a: 213 }
asd = null
```

> 执行解除引用语句并不是马上将变量占用的内存释放，而是将其加入标记，以便下一次垃圾回收操作运行时将其回收。

## 3. 引用类型
### 1. 对象字面量

声明对象一般有两种方式，一是通过`new`操作符创建`Object`构造函数的实例，二是通过对象字面量语法进行创建
```js
// new
var obj1 = new Object()
// 对象字面量
var obj2 = {}
```

> 1. 在运用对象字面量创建对象时，实际上不会调用`Object`构造函数
> 2. 一般来讲，在封装函数时，虽然命名参数容易处理，但在处理大量数据时则会显得不够灵活，因此一般对必须传入的参数用命名参数处理，而大量的可选参数则使用对象字面量传入。

### 2. 数组操作符

1. `arr.push()`：入栈。可以同时推入多个值，如`arr.push(1, 2, 3)`，则会依次在数组最后追加1、2、3三个值。
2. `arr.pop()`：出栈。对数组最后一个值执行出栈操作，并返回这个值，出栈操作会修改原数组。
3. `arr.unshift()`：进入队列。在数组最前推入值，同样可以推入多个值：`arr.unshift(1, 2, 3)`。
4. `arr.shift()`：退出队列。将数组第一项退出队列，并返回这个值，退出队列操作会修改原数组。
5. `arr.reverse()`：反转。单纯用于反转数组顺序，如`[1, 3, 2, 5, 4].reverse()`会得到`[4, 5, 2, 3, 1]`
6. `arr.sort()`：排序。默认情况下，`sort()`对数组进行升序排序，这种升序排序是调用每个数组项的`toString()`方法转型再进行比较，即使所有数组项都是数字，因此一般在`sort()`中传入比较函数去实现正确的排序

> 比较函数接收两个参数，如果第一个参数应该位于第二个参数之前则返回一个负数，如果两个参数相等则返回0，如果第一个参数应该位于第二个参数之后则返回一个正数。

```js
// 这个比较函数适用于大多数数据类型，调用时将整个函数作为参数传入到sort()中即可
function compare (val1, val2) {
    if (val1 < val2) {
        return -1
    } else if (val1 > val2) {
        return 1
    } else {
        return 0
    }
}

var arr = [1, 3, 2, 5, 4]
arr.sort(compare) // [1, 2, 3, 4, 5]

// 对于数值类型或调用其valueOf()方法会返回数值的变量类型，可以使用这个更简单的函数
function compareEasy (val1, val2) {
    return val2 - val1
}
```

7. `arr1.concat()`：拼接。先创建一个数组的副本，再将参数拼接到这个副本后面

```js
// 若没有接收到参数，则返回该副本，此方法可用于进行数组深复制
var copy = [1, 2, 3].concat() // [1, 2, 3]
// 若接收到的参数是一个或多个数组，则将数组所有项添加到结果数组最后
var arr1 = [1, 2, 3].concat([4, 5], [6]) // [1, 2, 3, 4, 5, 6]
// 若接收到的参数不是数组，这些值则会被简单的添加到结果数组后面
var arr2 = [1, 2, 3].concat(4, 5) // [1, 2, 3, 4, 5]
```

8. `arr.split()`：基于数组中的一个或多个项创建新数组

```js
// 传入一个参数，返回包含这个位置到数组末尾内容的新数组
var arr1 = [1, 2, 3, 4, 5].slice(1) // [2, 3, 4, 5]
// 传入两个参数，返回包含开始位置到不包含结束位置内容的新数组
var arr2 = [1, 2, 3, 4, 5].slice(1, 4) // [2, 3, 4]
// 传入参数为负数，则将开始与结束位置从数组最后一项开始计算，返回新数组
var arr3 = [1, 2, 3, 4, 5].slice(-2, -1) // [4]
// 如果结束位置小于起始位置，则返回空数组
var arr4 = [1, 2, 3, 4, 5].slice(-1, -2) // []
```

9. `arr.splice()`：提供数组的插入、删除和替换功能，调用这个函数时始终会返回一个数组，包含了从原始数组中删除的项（若没有删除则返回空数组）

```js
// 删除：指定要删除第一项的位置与要删除的项数
var arr1 = [1, 2, 3, 4, 5].splice(0, 2) // 返回：[1, 2]，原数组：[3, 4, 5]
// 插入：指定要插入项的位置，0（删除项数）和要插入的项
var arr2 = [1, 2, 3, 4, 5].splice(2, 0, 'a', 'b') // 返回：[]，原数组：[1, 2, 'a', 'b', 3, 4, 5]
// 替换：指定要插入项的位置，删除项数和要插入的项
var arr2 = [1, 2, 3, 4, 5].splice(2, 1, 'a', 'b') // 返回：[3]，原数组：[1, 2, 'a', 'b', 4, 5]
```

10. `arr.indexOf() & arr.lastIndexOf()`：用于查找某个项在数组中的位置，区别是`indexOf()`从数组开头开始查找，`lastIndexOf()`从数组末尾开始查找，它们都包含两个参数，一是要查找的项，二是查找起点的位置，它在查找比较的时候使用全等操作符，因此必须保证查找项与目标的数据类型一致

```js
var arr = [1, 2, 3, 2, 1]
arr.indexOf(0) // -1
arr.indexOf(1) // 0
arr.lastIndexOf(1) // 4
arr.indexOf(1, 2) // 4
// 它在查找引用类型变量时是通过引用进行对比
var obj = { attr: 1 }
var arr1 = [{ attr: 1 }]
var arr2 = [obj]
arr1.indexOf(obj) // -1
arr2.indexOf(obj) // 0
```

11. `arr.every() & arr.filter() & arr.forEach() & arr.map() & arr.some()`：迭代。每个方法都接收两个参数：要在每一项上运行的函数和运行该函数的作用域对象——影响this的值。传入这些方法中的函数会接收三个参数：数组项的值、该项在数组中的位置和数组本身。

> `every()`：对数组中的每一项运行给定函数，如果该函数对每一项都返回`true`，则返回`true`。<br>
`filter()`：对数组中每一项运行给定函数，返回该函数会返回`true`的项组成的数组。<br>
`forEach()`：对数组中每一项运行给定函数，没有返回值。<br>
`map()`：对数组中每一项运行给定函数，返回每次函数调用调用的结果组成的数组。<br>
`some()`：对数组中的每一项运行给定函数，如果该函数对任一项返回`true`，则返回`true`

12. `arr.reduce() & arr.reduceRight()`：归并。迭代所有数组项，构建一个返回值，它们都接收两个参数，一个在每一项上调用的函数和作为归并基础的初始值（可选），传入的函数接收4个参数：前一个值、当前值、项的索引和数组对象。

```js
// 对所有数组项求和
var values = [1, 2, 3, 4, 5]
var sum = values.reduce(function (prev, cur, index, array) {
    return prev + cur
}) // 15
```

### 3. `Date`对象

1. `Date.parse()`：可以用于将固定的日期格式字符串转换为时间戳，支持下列日期格式

> 月/日/年：`6/13/2018`<br>
英文月名 日,年：`January 12,2018`<br>
英文星期几 英文月名 日 年 时:分:秒 时区：`Tue May 25 2018 00:00:00 GMT-0700`<br>
`ISO8601`扩展格式 `YYYY-MM-DDTHH:mm:ss:sssZ`：`2018-05-25T00:00:00`

2. `Date.now()`：用于更便捷地获取当前系统时间戳
3. `Date`类型的实例可以直接用大于小于号进行比较，它会调用其`valueOf()`方法将日期对象转换为时间戳，再进行数值间的比较。

### 4. `RegExp`对象

1. 使用字面量方式创建正则：`var expression = / pattern / flags`。每个正则都会有一个或多个标识(`flags`)，标明正则表达式的行为。

> `g`：表示全局(`global`)模式，意味着正则会匹配所有的字符，而不是匹配到第一个字符就终止。<br>
`i`：表示不区分大小写(`case-insensitive`)模式，在匹配时不区分大小写。<br>
`m`：表示多行(`multiline`)模式，即在到达一行文本末尾时还会继续查找下一行中是否存在匹配正则的项。

> `RegExp`属性↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

2. `global`：布尔值，表示是否设置了`g`标识<br>
3. `ignoreCase`：布尔值，表示是否设置了`i`标识<br>
4. `multiline`：布尔值，表示是否设置了`m`标识<br>
5. `lastIndex`：整数，表示上一次匹配成功位置的下一个位置，下一次搜索从这个位置开始<br>
6. `source`：正则表达式的字符串表示，按照字面量形式而非传入构造函数的字符串模式返回

> `RegExp`方法↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

7. `exec()`：它接收一个参数，用于匹配正则的字符串，返回包含第一个匹配项信息的数组。同一个正则连续进行exec()会匹配到下一个满足规则的位置（区别于只能返回第一个匹配位置的`test()`）

```js
var text = 'cat, bat, sat, fat'
var pattern = /.at/g
var matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches[0]) // cat
console.log(matches.lastIndex) // 3
matches = pattern.exec(text)
console.log(matches.index) // 5
console.log(matches[0]) // bat
console.log(matches.lastIndex) // 8
```

8. `RegExp`原型属性：这些属性基于最近执行的一次正则表达式生成

长属性名 | 短属性名 | 说明
---|---|---
`input` | $_ | 最近一次要匹配的字符串。Opera未实现该属性
`lastMatch` | $& | 最近一次的匹配到的内容。Opera未实现该属性
`lastParen` | $+ | 最近一次匹配的捕获组。Opera未实现该属性
`leftContext` | $` | input字符串中lastMatch之前的文本
`multiline` | $* | 布尔值，表示是否所有正则都使用多行模式。IE和Opera未实现该属性
`rightContext` | $' | input字符串中lastMatch之后的文本

```js
var text = 'this has been a short summer'
var pattern = /(.)hort/g
if (pattern.test(text)) {
    console.log(RegExp.input) // this has been a short summer
    console.log(RegExp.leftContext) // this has been a
    console.log(RegExp.rightContext) // summer
    console.log(RegExp.lastMatch) // short
    console.log(RegExp.lastParen) // s
    console.log(RegExp.multiline) // false
}
```

9. `RegExp`还提供了`RegExp.$1`等九个用于存储第一到第九个捕获组，在调用`exec()`或`test()`时这些捕获组就会自动填充。

```js
var text = 'this has been a short summer'
var pattern = /(..)or(.)/g

if (pattern.test(text)) {
    alert(RegExp.$1)
    alert(RegExp.$2)
}
```

### 5. `Function`类型

1. `arguments.callee`：用于在函数内部获取使用这个参数函数本身：

```js
// 阶乘，一般使用递归实现，但这个方法却会与函数名耦合
function factorial (num) {
    if (num <= 1) {
        return 1
    } else {
        return num * factorial(num - 1)
    }
}
// 使用arguments.callee解耦
function factorial (num) {
    if (num <= 1) {
        return 1
    } else {
        return num * arguments.callee(num - 1)
    }
}
```

2. `arguments.callee.caller`：使用函数的`caller`属性可以访问调用这个函数的环境，在函数内部可以通过`arguments.callee.caller`访问，`ES5`还定义了值为`undefined`的`arguments.caller`字段与函数本身的`caller`字段进行区分。而在严格模式下，访问`arguments.callee`和`arguments.caller`都会导致错误。
3. `length & prototype`：分别保存函数希望接收参数的个数和函数的原型对象。

> ES6中length只会返回没有指定默认值的参数个数

```js
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
```

4. `call() & apply()`：可以改变函数的作用域来进行调用，区别是`call()`方法的传参是将参数用逗号连接，`apply()`方法的传参是将参数包含在一个数组中：

```js
function sum (num1, num2) {
    return num1 + num2
}
function callSum1 (num1, num2) {
    return sum.apply(this, arguments)
}
function callSum2 (num1, num2) {
    return sum.apply(this, [num1, num2])
}
function callSum3 (num1, num2) {
    return sum.call(this, num1, num2)
}
console.log(callSum1(10, 10)) // 20
console.log(callSum2(10, 10)) // 20
console.log(callSum3(10, 10)) // 20
```

上面`apply()`与`call()`调用时第一个传入的参数`this`指的就是调用时所要指向的作用域：

```js
window.color = 'red'
var o = { color: 'blue' }

function sayColor () { alert(this.color) }

sayColor() // red：调用环境为全局作用域，因此得到window.color
sayColor.call(this) // red：传入this指定为全局作用域，得到window.color
sayColor.call(window) // red：作用域直接指定为window，得到window.color
sayColor.call(o) // blue：作用域指定为o，得到o.color
```

拓展ES6声明方式的结果解析

```js
// 箭头函数在定义时已经确定this的指向；箭头函数没有自己的this，它始终引用外层函数的this
window.color = 'red'
var o = {
    color: 'blue',
    sayColor: () => { alert(this.color) }
}

o.sayColor() // red：箭头函数中this指向声明时外层函数的this，此处外层只有全局作用域，因此取window.color
o.sayColor.call(this) // red：指定了全局作用域，取window.color
o.sayColor.call(window) // red：指定了全局作用域，取window.color
o.sayColor.call(o) // red：箭头函数中this指向声明时外层函数的this，此处外层只有全局作用域，因此取window.color
```

```js
// 等同于sayColor: function () { alert(this.color) }
window.color = 'red'
var o = {
    color: 'blue',
    sayColor () { alert(this.color) }
}

o.sayColor() // blue：从o中调用时默认使用o为当前作用域，取o.color
o.sayColor.call(this) // red：指定了全局作用域，取window.color
o.sayColor.call(window) // red：指定了全局作用域，取window.color
o.sayColor.call(o) // blue：指定了o为作用域，取o.color
```

5. `bind()`：也可以用来改变函数作用域，但是这个方法返回一个改变作用域后的函数声明，需要再接上一对圆括号才会执行

```js
window.color = 'red'
var o = { color: 'blue' }

function sayColor () { alert(this.color) }

sayColor.bind(o)() // blue
```

### 6. 基本包装类型`Boolean`、`String`、`Number`

1. 事实上，访问一个基础类型值的方法或属性时，`js`引擎会进入一种“读取模式”，它会创建基础类型的实例对象，再调用实例对象中的属性或方法，再把这个实例对象注销：

```js
// 执行这些代码时
var s1 = 'abc'
var s2 = s1.substring(s1)
// 事实上引擎是这样操作的
var s1 = new String('abc')
var s2 = s1.substring(s1)
s1 = null
```

使用`new`操作符创建的对象实例与基本包装类型区别在于其声明周期，对象实例在执行流离开当前作用域之前会一直存在（就像一个引用类型变量），而基本包装类型则只在一行代码访问它的时候创建，离开这行代码就会立即销毁：

```js
var s1 = 'abc'
s1.color = 'blue'
console.log(s1.color) // undefined
```

> `Number`类型方法↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

1. `toExponential()`：返回数字的科学计数法表示，它接收一个，参数表示保留到小数点后的位数

```js
var num = 10
console.log(num.toExponential(1)) // '1.0e+1'
```

2. `toPrecision()`：返回数字最合理的表示方式，可能是科学计数法也可能是数值，它接收一个参数，表示所有数值的位数

```js
var num = 99
console.log(num.toPrecision(1)) // '1e+2'：在需要舍弃末尾数时进行四舍五入
console.log(num.toPrecision(2)) // '99'
console.log(num.toPrecision(3)) // '99.0'
```

> `String`类型方法↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

1. `concat()`：连接字符串

2. `slice() & substr() & substring()`：这三个方法会基于被操作字符串返回一个子字符串，它们接收一或两个参数：第一个指向操作的开始位置，第二个指向操作的结束位置（其中`slice()`和`substring()`的二参数指操作最后一个字符的位置，`substr()`的二参数指操作的字符个数）

```js
var str = 'hello world'
str.slice(3) // 'lo world'
str.substring(3) // 'lo world'
str.substr(3) // 'lo world'
str.slice(3, 7) // 'lo w'
str.substring(3, 7) // 'lo w'
str.substr(3, 7) // 'lo worl'
// 传入负数时，三个方法的处理方式则不同：slice()将负数与字符串长度相加；substr()将第一个参数与字符串长度相加、第二个参数转换为0；substring()会将所有负值参数转换为0
var str = 'hello world'
str.slice(-3) // 'rld'
str.substring(-3) // 'hello world'
str.substr(-3) // 'rld'
str.slice(3, -4) // 'lo w'
str.substring(3, -4) // 'hel'
str.substr(3, -4) // ''
```

3. `indexOf() & lastIndexOf()`：传入两个参数，要匹配的字符串和开始匹配的位置，返回第一个匹配到的内容的位置
4. `trim()`：删除字符串前置与后缀的所有空格
5. `toUpperCase() & toLocaleUpperCase() & toLowerCase() & toLocaleLowerCase()`：字符全部替换为大/小写，Locale针对不同语言环境做了特定的实现，一般在不知道语言环境的情况下用Locale系列比较稳妥
6. `match() & search()`：
共同点：都接收一个参数，返回匹配到第一个字符串的值
不同点：search()只能接收正则，match()可以接收字符串或正则；search()只能从字符串开头查找匹配的第一个位置（会忽略g的全局标识），match()若没有设置g标识，表现与search()一样，若设置了g标识，则会进行全局检索，返回由捕获组组成的数组（与RegExp对象的exec()方法返回结果一样）

```js
var text = 'cat, bat, sat, fat'
var pattern = /.at/

var matches = text.match(pattern)
console.log(matches.index) // 0
console.log(matches[0]) // 'cat'
console.log(pattern.lastIndex) // 0

var pos = text.search(/at/)
console.log(pos) // 1
```

7. `replace()`：它接收两个参数，一是一个字符串或一个正则，指定要被替换的内容；二是一个字符串，指定要替换进去的内容。如果要对所有匹配到的字符进行替换，则必须在第一个参数传入正则并带上参数

```js
var text = 'cat, bat, sat, fat'
var result = text.replace('at', 'ond') // 'cond, bat, sat, fat'
result = text.replace(/at/g, 'ond') // 'cond, bond, sond, fond'
```

在第二个参数中还可以使用一些特殊的字符序列来把正则匹配到的值插入到结果字符串中

字符序列 | 替换文本
---|---
$$ | $
$& | 匹配整个模式的子字符串，与RegExp.lastMatch的值相同
$' | 匹配的子字符串之后的子字符串，与RegExp.leftContext的值相同
$` | 匹配的子字符串之前的子字符串，与RegExp.rightContext的值相同
$n | 匹配第n个捕获组的子字符串，，从1~9，如$1
$nn | 匹配第nn个捕获组的子字符串，从01-99，如$01

```js
var text = 'cat, bat, sat, fat'
var result = text.replace(/(.at)/g, 'word($1)') // 'word(cat), word(bat), word(sat), word(fat)'
result = text.replace(/(.at)/g, 'word($&)') // 'word(cat), word(bat), word(sat), word(fat)'
result = text.replace(/(.at)/g, 'word($\')') // 'word(, bat, sat, fat), word(, sat, fat), word(, fat), word()'
result = text.replace(/(.at)/g, 'word($\`)') // 'word(), word(cat, ), word(cat, bat, ), word(cat, bat, sat, )'
```

第二个参数还可以传入一个函数，通过`return`指定要替换进去的值。在只有一个匹配项的时候，会向函数传递三个参数：模式的匹配项、模式匹配项在字符串中的位置和原始字符串

```js
function htmlEscape (text) {
    return text.replace(/[<>"&]/g, function (match, pos, originalText) {
        switch (match) {
            case '<': return '&lt;'
            case '>': return '&gt;'
            case '"': return '&quot;'
            case '&': return '&amp;'
        }
    })
}
alert(htmlEscape('<p class="greeting">Hello world</p>')) // &lt;p class=&quot;greeting&quot;&gt;Hello world&lt;/p&gt;
```

8. `split()`：用于将字符串按照指定的分隔符切割成多段，并将结果放在一个数组中，它接收两个参数：一是一个正则或一个字符串，用于指定分隔符；二是一个数字，用于限定结果数组的长度

```js
var text = 'cat,bat,sat,fat'
text.split(',') // ['cat', 'bat', 'sat', 'fat']
text.split(',', 2) // ['cat', 'bat']
text.split(/[^\,]+/) // ['', ',', ',', ',', '']
```

9. `localeCompare()`：用于比较主体与参数字符串在字母表中的先后顺序，返回结果与地区语言有关
10. `fromCharCode()`：静态方法，将字符编号转化为字符，本质上是与实例方法charCodeAt()执行相反的操作

```js
String.fromCharCode(104, 101, 108, 108, 111) // hello
```