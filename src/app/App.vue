<template>
  <div id="app" :class="currentTheme ? 'dark' : 'light'">
    <div id="Page-404" v-if="this.$route.path.startsWith('/404')">
      <Page404>
        <div></div>
      </Page404>
    </div>
    <div id="View" v-else>
      <Home :toggleTheme="toggleTheme" :currentTheme="currentTheme">
        <div>
          <router-view></router-view>
        </div>
      </Home>
    </div>
  </div>
</template>

<script>
import App from './App';

export default App;
</script>

<style lang="scss">
@import './App.scss';
</style>
