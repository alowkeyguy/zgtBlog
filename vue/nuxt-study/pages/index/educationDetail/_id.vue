<template>
  <div>
    <h3 class="title">{{detail.title}}</h3>
    <p class="tip">此新闻id：<span class="tip__id">{{currentId}}</span></p>
    <p class="content">{{detail.content}}</p>
  </div>
</template>

<script>
import api from '~/api'
export default {
  data() {
    return {
      detail: {}
    }
  },
  created() {
    this.getDate(this.currentId)
  },
  methods: {
    async getDate(id) {
      let {data} = await api.news.getNewsDetailById()
      if (data.code !== 200) return
      this.detail = data.data
    }
  },
  computed: {
    currentId() {
      return this.$route.params.id
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.tip {
  text-align: right;
  font-size: 14px;
  color: #1890ff;
  margin: 25px 0;
  &__id {
    color: #f5222d
  }
}
.content {
  font-size: 18px;
  line-height: 30px;
  text-indent: 30px;
  min-height: 900px;
}
</style>

