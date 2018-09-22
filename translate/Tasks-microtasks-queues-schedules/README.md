# Tasks(任务), microtasks(微任务), queues（队列） and schedules（回调队列）
如果你更喜欢视频，[Philip Roberts](https://twitter.com/philip_roberts) 在 JSConf 上就[事件循环](https://www.youtube.com/watch?v=8aGhZQkoFbQ)有一个很棒的演讲——没有讲 microtasks，不过很好的介绍了其它概念。好，继续！

## 试一下
```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```
结果是：script start, script end, promise1, promise2, setTimeout，但是各浏览器不一致。

Microsoft Edge, Firefox 40, iOS Safari 及桌面 Safari 8.0.8 在 promise1 和 promise2 之前打印 setTimeout ——尽管这似乎是竞争条件导致的。奇怪的是，Firefox 39 和 Safari 8.0.7 是对的。

## 为什么是这样的
要想弄明白为什么，你需要知道事件循环如何处理 tasks 和 microtasks。第一次接触需要花些功夫才能弄明白。深呼吸……

每个线程都有自己的事件循环，所以每个 web worker 有自己的事件循环（event loop），所以它能独立地运行。而所有同源的 window 共享一个事件循环，因为它们能同步的通讯。事件循环持续运行，执行 tasks 列队。一个事件循环有多个 task 来源，并且保证在 task 来源内的执行顺序（IndexedDB 等规范定义了自己的 task 来源），在每次循环中浏览器要选择从哪个来源中选取 task，这使得浏览器能优先执行敏感 task，例如用户输入。Ok ok, 留下来陪我坐会儿……

Tasks 被列入队列，于是浏览器能从它的内部转移到 Javascript/DOM 领地，并且确使这些 tasks 按序执行。在 tasks 之间，浏览器可以更新渲染。来自鼠标点击的事件回调需要安排一个 task，解析 HTML 和 setTimeout 同样需要。

setTimeout 延迟给定的时间，然后为它的回调安排一个新的 task。这就是为什么 setTimeout 在 script end 之后打印，script end 在第一个 task 内，setTimeout 在另一个 task 内。好了，我们快讲完了，剩下一点我需要你们坚持下……

Mircotasks 通常用于安排一些事，它们应该在正在执行的代码之后立即发生，例如响应操作，或者让操作异步执行，以免付出一个全新 task 的代价。mircotask 队列在回调之后处理，只要没有其它执行当中的（mid-execution）代码；或者在每个 task 的末尾处理。在处理 microtasks 队列期间，新添加的 microtasks 添加到队列的末尾并且也被执行。 microtasks 包括 mutation observer 回调。上面的例子中的 promise 的回调也是。

promise 一旦解决（settled），或者已解决，它便为它的回调安排一个 microtask。这确使 promise 回调是异步的，即便 promise 已经解决。因此一个已解决的 promise 调用 .then(yey, nay) 将立即把一个 microtask 加入队列。这就是为什么 promise1 和 promise2 在 script end 之后打印，因为正在运行的代码必须在处理 microtasks 之前完成。promise1 和 promise2 在 setTimeout 之前打印，因为 microtasks 总是在下一个 task 之前执行。

好吧，一步一步运行
```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
```
(注：原文表示运行结果为：'script start', 'script end', 'promise1', 'promise2', 'setTimeout')

### 为什么有些浏览器表现不一致
一些浏览器的打印结果：script start, script end, setTimeout, promise1, promise2。在 setTimeout 之后运行 promise 的回调，就好像将 promise 的回调当作一个新的 task 而不是 microtask。

这多少情有可原，因为 promise 来自 ECMAScript 规范而不是 HTML 规范。ECAMScript 有一个概念 job，和 microtask 相似，但是两者的关系在[邮件列表讨论中](https://esdiscuss.org/topic/the-initialization-steps-for-web-browsers#content-16)没有明确。不过，一般共识是 promise 应该是 microtask 队列的一部分，并且有充足的理由。

将 promise 当作 task 会导致性能问题，因为回调可能不必要地被与 task 相关的事（比如渲染）延迟。与其它 task 来源交互时它也导致不确定性，也会打断与其它 API 的交互，不过后面再细说。

我提交了一条 [Edge 反馈](https://docs.microsoft.com/en-us/collaborate/connect-redirect)，它错误地将 promises 当作 task。WebKit nightly 做对了，所以我认为 Safari 最终会修复，而 Firefox 43 似乎已经修复。

有趣的是 Safari 和 Firefox 发生了退化，而之前的版本是对的。我在想这是否只是巧合。
## 怎么判断是task还是mictask
测试是一种办法，查看相对于 promise 和 setTimeout 如何打印，尽管这取决于实现是否正确。

一种方法是查看规范。例如，[setTimeout 的第十四步](https://html.spec.whatwg.org/multipage/webappapis.html#timer-initialisation-steps)将一个 task 加入队列，[mutation record 的第五步](https://dom.spec.whatwg.org/#queue-a-mutation-record)将 microtask 加入队列。

如上所述，ECMAScript 将 microtask 称为 job。[PerformPromiseThen 的第八步](http://www.ecma-international.org/ecma-262/6.0/#sec-performpromisethen) 调用 EnqueueJob 将一个 microtask 加入队列。

现在，让我们看一个更复杂的例子。（一个有心的学徒 ：“但是他们还没有准备好”。别管他，你已经准备好了，让我们开始……）
## level 1
在写这篇文章之前我一直 会在这里出错。下面是 html 代码片段：
```
<div class="outer">
  <div class="inner"></div>
</div>
```
有如下的 Javascript 代码，假如我点击 div.inner 会打印什么？
```
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```
在给出答案前先实际运行一下吧
## 测试
点击里面的矩形触发一个 click 事件：

你的猜测是否不同？若是，你也可能是对的。但不幸的是各浏览器不一致：

![chrome](./static/chrome.png) | ![firefox](./static/firefox.png) | ![edge](./static/edge.png) | ![safari.png](./static/safari.png)
---------- | ----------- | ---------- | ----------
  click    |   click     |   click    |  click
  promise  |   mutate    |   click    |  mutate
  mutate   |   click     |   mutate   |  click
  click    |   mutate    |   timeout  |  mutate
  promise  |   timeout   |   promise  |  promise
  mutate   |   promise   |   timeout  |  promise
  timeout  |   promise   |   promise  |  timeout
  timeout  |   timeout   |            |  timeout

## 哪个是正确的

一个 microtask checkpoint 逐个检查 microtask 队列，除非我们已经在处理一个 microtask 队列。类似地，ECMAScript 规范这么说 jobs：
> Execution of a Job can be initiated only when there is no running execution context and the execution context stack is empty…

ECMAScript: Jobs and Job Queues
触发 click 事件是一个 task，Mutation observer 和 promise 回调作为 microtask 加入列队，setTimeout 回调作为 task 加入列队。因此运行过程如下：
```
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});
```
所以 Chrome 是对的。对我来说新发现是，microtasks 在回调之后运行（只要没有其它的 Javascript 在运行，我原以为它只能在 task 的末尾运行。这个规则来自 HTML 规范，调用一个回调：
> If the [stack of script settings objects](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects) is now empty，[perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)。
>— HTML: [回调之后的清理](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback)第三步

一个 microtask checkpoint 逐个检查 microtask 队列，除非我们已经在处理一个 microtask 队列。类似地，ECMAScript 规范这么说 jobs：
> Execution of a Job can be initiated only when there is no running execution context and the execution context stack is empty…
> * [ECMAScript: Jobs and Job Queues](https://link.juejin.im/?target=http%3A%2F%2Fwww.ecma-international.org%2Fecma-262%2F6.0%2F%23sec-jobs-and-job-queues)

尽管在 HTML 中"can be"变成了"must be"
## 其它浏览器哪里错了了
对于 mutation 回调，Firefox 和 Safari 正确地在单击回调之间清空 microtask 队列，但是 promises 列队似乎不一样。这多少情有可原，因为 jobs 和 microtasks 的关系不清楚，但是我仍然期望在事件回调之间处理。[Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1193394)。 [Safari bug](https://bugs.webkit.org/show_bug.cgi?id=147933)。

对于 Edge，我们已经看到它错误的将 promises 当作 task，它也没有在单击回调之间清空 microtask 队列，而是在所有单击回调执行完之后清空，于是总共只有一个 mutate 在两个 click 之后打印。 [Edge bug](https://docs.microsoft.com/en-us/collaborate/connect-redirect)。
## level 1 愤怒的老大哥
我们用同样的例子运行:
```
inner.click();
```
跟之前一样，它会触发 click 事件，不过是通过代码而不是实际的交互动作。
## 试一下
![chrome](./static/chrome.png) | ![firefox](./static/firefox.png) | ![edge](./static/edge.png) | ![safari.png](./static/safari.png)
---------  | --------- | ---------- | -----------
  click    |  click    |  click     |   click
  click    |  click    |  click     |   click
  promise  |  mutate   |  mutate    |   mutate
  mutate   |  timeout  |  timeout   |   promise
  promise  |  promise  |  promise   |   promise
  timeout  |  promise  |  timeout   |   timeout
  timeout  |  timeout  |  promise   |   timeout

我发誓我在 Chrome 中始终得到不同的结果，我更新了这个表许多次才意识到我测试的是 Canary。假如你在 Chrome 中得到了不同的结果，请在评论中告诉我是哪个版本。
## 为什么不同
它应该像下面这样运行：
```
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);

inner.click();
```
正确的顺序是：click, click, promise, mutate, promise, timeout, timeout，似乎 Chrome 是对的。

在每个事件回调调用之后：
> If the [stack of script settings objects](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects) is now empty，[perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint).
— HTML: [回调之后的清理](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback)第三步

之前，这意味着 microtasks 在事件回调之间运行，但是 .click() 让事件同步触发，所以调用 .click() 的代码仍然在事件回调之间的栈内。上面的规则确保了 microtasks 不会中断执行当中的代码。这意味着 microtasks 队列在事件回调之间不处理，而是在它们之后处理。
## 这重要吗
重要，它会在偏角处咬你（疼）。我就遇到了这个问题，在我尝试用 [promises 而不是用怪异的 IDBRequest 对象为 IndexedDB 创建一个简单的包装库](https://github.com/jakearchibald/idb/blob/master/lib/idb.js) 时。[它让 IDB 用起来很有趣](https://github.com/jakearchibald/idb/blob/master/test/idb.js#L36)。

当 IDB 触发成功事件时，相关的 transaction 对象在事件之后转为非激活状态（第四步）。如果我创建的 promise 在这个事件发生时被履行（resolved)，回调应当在第四步之前执行，这时这个对象仍然是激活状态。但是在 Chrome 之外的浏览器中不是这样，导致这个库有些无用。

实际上你可以在 Firefox 中解决这个问题，因为 promise polyfills 如 [es6-promise](https://github.com/stefanpenner/es6-promise) 使用 mutation observers 执行回调，它正确地使用了 microtasks。而它在 Safari 下似乎存在竞态条件，不过这可能是因为他们 [糟糕的 IDB 实现](https://www.raymondcamden.com/2014/09/25/IndexedDB-on-iOS-8-Broken-Bad)。不幸的是 IE/Edge 不一致，因为 mutation 事件不在回调之后处理。

希望不久我们能看到一些互通性。
## 你做到了！
总结：
* tasks 按序执行，浏览器会在 tasks 之间执行渲染。
* microtasks 按序执行，在下面情况时执行：
  * 在每个回调之后，只要没有其它代码正在运行。
  * 在每个 task 的末尾

希望你现在明白了事件循环，或者至少得到一个借口出去走一走躺一躺。