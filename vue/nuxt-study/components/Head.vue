<template>
  <div class="wrap">
    <app-logo class="wrap__logo" />
    <h3 class="wrap__title">VUE 服务器渲染 （NUXTJS）</h3>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo'
export default {
  components: {
    AppLogo
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: row;
  padding-top: 15px;
  padding-bottom: 20px;
  &__logo {
    margin-right: 10px;
    margin-left: 20px;
  }
  &__title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

