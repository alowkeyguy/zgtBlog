<template>
  <div>
    <news-list
      @handlcurrentChange="handlcurrentChange"
      @detail="detail"
      :totalPage="totalPage"
      :list="list"
    />
  </div>
</template>

<script>
import NewsList from '~/components/NewsList.vue'
import api from '~/api'
export default {
  components: {
    NewsList
  },
  data() {
    return {
      list: [],
      totalPage: 1
    }
  },
  async asyncData({params, error}) {
    let { data } = await api.news.getNewsList()
    return { list: data.data, totalPage: data.totalPage}
  },
  methods: {
    // 翻页
    handlcurrentChange (pageIndex) {
      api.news.getNewsList(pageIndex).then(_ => {
        let res = _.data
        if (res.code !== 200) return
        this.totalPage = res.totalPage
        this.list = res.data
      })
    },
    detail (id) {
      this.$router.push({
        path: `/educationDetail/${id}`
      })
    }
  }
}
</script>

<style>

</style>
