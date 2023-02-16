<template>
  <div>
    <v-app-bar app fixed color="indigo" dark>
      <v-toolbar-title>
        <img
          class="mr-4 logo-pokedex"
          :src="require('../assets/img/pokedex.png')"
          height="50"
        />
        <img
          class="mr-2 mt-2"
          :src="require('../assets/img/pokecoins.png')"
          height="50"
        />
      </v-toolbar-title>
      <h2 class="white--text">{{ coins }}</h2>

      <v-spacer />
      <v-menu
        offset-y
        v-if="!showMenu && $vuetify.breakpoint.smAndDown"
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list color="indigo">
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'home' }"
            >Inicio</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'coleccion' }"
            >Colección</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'tienda' }"
            >Tienda</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'admin' }"
            >Admin Panel</v-list-item
          >
        </v-list>
      </v-menu>
      <v-toolbar-items v-if="!showMenu && $vuetify.breakpoint.mdAndUp">
        <v-btn class="white--text" text :to="{ name: 'home' }">Inicio</v-btn>
        <v-btn class="white--text" text :to="{ name: 'coleccion' }"
          >Colección</v-btn
        >
        <v-btn class="white--text" text :to="{ name: 'tienda' }">Tienda</v-btn>
        <v-btn class="white--text" text :to="{ name: 'admin' }">Admin Panel</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "navBar",
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    ...mapState(["coins"]),
  },
};
</script>
