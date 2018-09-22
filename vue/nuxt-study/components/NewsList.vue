<template>
  <div>
    <div :key="item.id" v-for="item in list" class="news" @click="detail(item.id)">
      <img :src="item.image" class="news__img" />
      <div class="news__text">
        <h3 class="news__text-title">{{item.title}}</h3>
        <p class="news__text-introduce">{{item.introduce}}</p>
      </div>
    </div>
    <el-pagination
      class="pagination"
      layout="prev, pager, next"
      @current-change="handlcurrentChange"
      :current-page="currentPage"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    totalPage: {
      type: Number,
      defalut: 1
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    handlcurrentChange(page) {
      this.$emit('handlcurrentChange', page)
    },
    detail(id) {
      this.$emit('detail', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.news {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  cursor: pointer;
  &__img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  &__text {
    flex: 1;
  }
  &:hover {
    color: #1890ff;
    &__text-title {
      color: #f5222d;
    }
    &__text-introduce {
      color: #1890ff;
    }
  }
}
.pagination {
  float: right;
  margin-top: 15px;
}
</style>
