<template>
  <v-app>
    <navBar></navBar>
    <v-main>
      <router-view/>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Pokedex from "./components/Pokedex.vue";
import navBar from "./components/navBar.vue"
import MiColeccion from "./components/MiColeccion.vue";
import Footer from './components/footer.vue';
export default {
  name: "App",
  components: {
    Pokedex,
    navBar,
    MiColeccion,
    Footer
},

  data: () => ({
    //
  }),
};
</script>
