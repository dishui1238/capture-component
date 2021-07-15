<template>
  <div id="app">
    <Page />
  </div>
</template>

<script>
import Page from './views/Page';
export default {
  name: 'app',
  components: { Page },
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
