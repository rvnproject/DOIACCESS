<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import '~pretty-checkbox/src/pretty-checkbox.scss';
@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-vue/dist/bootstrap-vue.css';

body {
  width: 360px;
  max-width: 360px;
  overflow-x: hidden;
  font-family: 'Dejavu Sans';
  font-size: 13px;
  margin: 0px;
  padding: 0px;
}
</style>
