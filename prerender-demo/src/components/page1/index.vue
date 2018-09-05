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
  beforeCreate () {
    // 在这里触发事件使插件捕获，测试时还是发现，axios加载的数据已经填充进html，初步猜测为在build时(插件会起一个浏览器运行代码)，从进入该路由到捕获html的过程中花时过长，异步数据已更新
    document.dispatchEvent(new Event('custom-render-trigger'))
  },
  mounted () {
    console.log(document)
    // debugger
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

<style>

</style>
