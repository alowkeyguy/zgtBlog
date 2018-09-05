<template>
  <div class="bottom">
    <h3 class="bottom__h3">这里是底部罗！</h3>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.bottom {
  height: 300px;
  background-color: #000000;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &__h3 {
    color: #ffffff;
    font-size: 22px;
  }
}
</style>

