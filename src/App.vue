<template>
  <RouterView></RouterView>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import IndexPage from "./components/IndexPage.vue";
import {RouterView, RouterLink} from "vue-router";

export default {
  name: 'App',
  components: {
    Login,
    Register,
    IndexPage,
    RouterView,
    RouterLink
  }
}
</script>
