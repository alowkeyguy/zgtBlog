<template>
    <div class="wrap">
      <h3 class="h3">这是page2</h3>
      <img class="img" :src="imgSrc" />
    </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'page2',
    meta: [{
      name: 'keyWords',
      content: '这个页面是page2'
    }],
    link: [{
      rel: 'stylesheet',
      href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    }]
  },
  data () {
    return {
      imgSrc: 'http://h.hiphotos.baidu.com/image/pic/item/267f9e2f07082838304837cfb499a9014d08f1a0.jpg'
    }
  },
  beforeCreate () {
    // document.dispatchEvent(new Event('custom-render-trigger'))
  }
}
</script>

<style>
.wrap {
  width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img {
  width: 100%;
  height: 800px;
}

</style>
