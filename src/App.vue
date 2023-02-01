<template>
  <v-app>
    <navBar></navBar>
    <PokedexView/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Pokedex from "./components/Pokedex.vue";
import navBar from "./components/navBar.vue"
import MiColeccion from "./components/MiColeccion.vue";
export default {
  name: "App",
  components: {
    Pokedex,
    navBar,
    MiColeccion
},

  data: () => ({
    //
  }),
};
</script>
