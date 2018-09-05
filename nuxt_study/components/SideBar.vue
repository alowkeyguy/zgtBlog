<template>
  <div class="muen">
    <a href="javascript:void(0)" class="muen__item" :class="{'muen__item--checked': item.routerName === currentRouterName}" @click="handleChangeMuen(item)" :key="index" v-for="(item, index) in muen">{{item.name}}</a>
  </div>
</template>

<script>
export default {
  props: {
    muen: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    handleChangeMuen(item) {
      this.$emit('handleChangeMuen', item.path)
    }
  },
  computed: {
    currentRouterName() {
      return this.$route.name
    }
  }
}
</script>

<style lang="scss" scoped>
.muen {
  &__item {
    height: 60px;
    line-height: 60px;
    background-color: #d9d9d9;
    text-align: center;
    display: block;
    text-decoration: none;
    color: #262626;
    &:hover {
      color: #1890ff;
      background-color: #000000;
    }
  }
  &__item--checked {
    background-color: #520339 !important;
    color: #ffffff;
  }
}
</style>

