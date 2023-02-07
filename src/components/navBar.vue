<template>
  <div>
    <v-toolbar>
      <!-- Adjust the height to your needs, mine is 40 -->
      <img
        class="mr-4"
        :src="require('../assets/img/pokedex.png')"
        height="50"
      />
      <v-toolbar-title
      >
        <img
        class="mr-2 mt-2"
        :src="require('../assets/img/pokecoins.png')"
        height="50"
      />
      </v-toolbar-title>
      <h2>{{ coins }}</h2>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text :to="{ name: 'home' }">Abrir Pokebolas</v-btn>
        <v-btn text :to="{ name: 'coleccion' }">Mi colección</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "navBar",

  data(){
    return {
    }
  },

  computed: {
    ...mapState(['coins'])
  },

};
</script>
