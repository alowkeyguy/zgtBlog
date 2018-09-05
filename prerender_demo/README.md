# 预渲染
> 我们按照vue-cli脚手架开发的vue项目，打包后是一个空的html和一些js、css，在浏览器拿到这些资源后就会根据js去请求数据、生成dom然后再插入html，这种就浏览器渲染，由于这种方式无法解决seo，而且白屏时间偏长导致对应的体验不佳，便有了预渲染和服务器渲染。
### 三种不同渲染方式的区别：
* **客户端渲染**：用户访问 url，请求 html 文件，前端根据路由动态渲染页面内容。关键链路较长，有一定的白屏时间；
* **服务端渲染**：用户访问 url，服务端根据访问路径请求所需数据，拼接成 html 字符串，返回给前端。前端接收到 html 时已有当前url下的完整页面；
* **预渲染**：构建阶段生成匹配预渲染路径的 html 文件（注意：每个需要预渲染的路由都有一个对应的 html）。构建出来的 html 文件已经有静态数据，需要ajax数据的部分未构建。
### 预渲染解决的问题
* **SEO**：单页应用的网站内容是根据当前路径动态渲染的，html 文件中往往没有内容，网络爬虫不会等到页面脚本执行完再抓取；
* **弱网环境**：当用户在一个弱环境中访问你的站点时，你会想要尽可能快的将内容呈现给他们。甚至是在 js 脚本被加载和解析前；
* **低版本浏览器**：用户的浏览器可能不支持你使用的 js 特性，预渲染或服务端渲染能够让用户至少能够看到首屏的内容，而不是一个空白的网页。

> 与服务器渲染（ssr）相对比，预渲染能与服务端渲染一样提高 SEO 优化，但是预渲染对配置更简单，实现成本低。弱网环境下，预渲染能更快地呈现页面内容，减少页面可见时间。

-----------------------------------------------
接下来我们实现下预渲染
1. vue-cli生成项目
```
# 安装 vue-cli
npm install -g vue-cli
# 初始化项目
vue init webpack rerender__test
# 安装依赖
cd rerender__test
yarn
// 安装prerender-spa-plugin
yarn add prerender-spa-plugin --dev
// 安装vue-meta-info
yarn add vue meta-info
```
2. 配置prerender-spa-plugin [githubx详情](https://github.com/chrisvfritz/prerender-spa-plugin)
```
<!-- webpack.prod.conf.js -->
const PrerenderSpaPlugin = require('prerender-spa-plugin')
...

plugins: [
  ...,
  new PrerenderSpaPlugin({
    //   编译后html需要存放的路径
    staticDir: path.join(__dirname, '../dist'),
    // 列出需要预渲染的路由
    routes: ['/page1', '/page2']
  })
]
```
3. 路由正常写
```
export default new Router({
  <!-- 要用history模式 -->
  mode: 'history',
  routes: [
    {
      path: '/page1',
      name: 'page1',
      component: () => import('@/components/page1')
    },
    {
      path: '/page2',
      name: 'page2',
      component: () => import('@/components/page2')
    },
    {
      path: '/page3',
      name: 'page3',
      component: () => import('@/components/page3')
    }
  ]
})
```
4. 代码
```
<!-- page1/index.vue代码 -->
<template>
    <div>
      <h3>这是page1</h3>
      <p>state里面的静态数据：{{staticData}}</p>
      <p>计算属性里的静态数据：{{staticComputed}}</p>
      <p>axios请求的数据list的长度为：{{listLength}}</p>
      <div v-for="(item, index) in list" :key="index">
        <h4>{{item.address}}</h4>
        <img :src="item.image" />
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  // 这个是配置head信息，vue-meta-info插进提供的功能
  metaInfo: {
    title: 'page1',
    meta: [{
      name: 'keyWords',
      content: '这个页面是page1'
    }],
    link: [{
      rel: 'stylesheet',
      href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    }]
  },
  data () {
    return {
      staticData: '这是data里的静态数据',
      forComputed: 10,
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    staticComputed () {
      return '这是计算属性里的静态数据' + this.forComputed * 66
    },
    listLength () {
      return this.list.length
    }
  },
  methods: {
    getList () {
      axios.get('http://rapapi.org/mockjsdata/35670/login/get', {params: {id: 11}}).then(_ => {
        let res = _.data
        this.list = res.data
      })
    }
  }
}
</script>
```
5. yarn run build
* 目录结构
```
├── dist
│   ├── index.html
│   ├── page1
│   │   └── index.html
│   ├── page2
│   │   └── index.html
│   └── static
├── src
│   ├── App.vue
│   ├── assets
│   ├── components
│   │   ├── HelloWorld.vue
│   │   ├── page1
│   │   │   └── index.vue
│   │   ├── page2
│   │   │   └── index.vue
│   │   └── page3
│   │       └── index.vue
│   ├── main.js
│   └── router
│       └── index.js
```
* page1/index.html
```
<!-- dist/page1/index.html -->
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>page1</title>
  <link href="/static/css/app.05e24694d1eab4bf2a3c0e1b579ae067.css" rel="stylesheet">
  <script type="text/javascript" charset="utf-8" async="" src="/static/js/0.0d9db27f9cb7a148cdca.js"></script>
  <meta data-vue-meta-info="true" name="keyWords" content="这个页面是page1">
  <link data-vue-meta-info="true" rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
</head>

<body>
  <div>
    <h3>这是page1</h3>
    <p>state里面的静态数据：这是data里的静态数据</p>
    <p>计算属性里的静态数据：这是计算属性里的静态数据660</p>
    <p>axios请求的数据list的长度为：10</p>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/52d228)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/1b0ce8)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/f7db9d)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/ef9977)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/cd66e9)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/0e0e7f)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/0fbdb1)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/e191af)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/4ff834)">
    </div>
    <div>
      <h4>测试内容g371</h4>
      <img src="http://dummyimage.com/1200x500/0ae451)">
    </div>
  </div>
  <script type="text/javascript" src="/static/js/manifest.f45cd573301737205ab1.js"></script>
  <script type="text/javascript" src="/static/js/vendor.41b1de9c48dd8a8c25a5.js"></script>
  <script type="text/javascript" src="/static/js/app.4dc161e30e2d37a0411a.js"></script>
</body>

</html>
```
