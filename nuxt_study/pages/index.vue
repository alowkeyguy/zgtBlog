<template>
  <div class="container">
    <Head class="head" />
    <div class="content">
      <side-bar :muen="muen" @handleChangeMuen="handleChangeMuen"  class="content__side"/>
      <nuxt-child class="content__news" />
    </div>
    <bottom class="bottom" />
  </div>
</template>

<script>
import Head from '~/components/Head'
import SideBar from '~/components/SideBar'
import Bottom from '~/components/Bottom'

export default {
  components: {
    Head,
    SideBar,
    Bottom
  },
  head() {
    return {
      title: '这是新闻首页',
      meta: [
        { hid: 'description', name: 'description', content: '这是useryemian一段描述文字' }
      ]
    }
  },
  data() {
    return {
      muen: [
        {name: '教育板块', path: '', routerName: 'index'},
        {name: '互联网板块', path: 'internet', routerName: 'index-internet'},
        {name: '煤炭开采板块', path: 'coal', routerName: 'index-coal'},
        {name: '证券板块', path: 'securities', routerName: 'index-securities'},
      ]
    }
  },
  methods: {
    handleChangeMuen(currrentMuen) {
      this.$router.push({
        path: `/${currrentMuen}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .head {
    background-color: #f5f5f5;
    margin-bottom: 30px;
    width: 100%;
  }
  .content {
    width: 1200px;
    &__side {
      float: left;
      width: 120px;
    }
    &__news {
      margin-left: 200px;
    }
    margin-bottom: 60px;
  }
  .bottom {
    width: 100%;
  }
</style>


