<template>
  <div class="container">
    <h1>
      <div class="container">
        <h2 v-if="!hasPokemons" class="text-center">
          Aún no tienes ningún pokemon
        </h2>

        <div class="d-flex flex-wrap" v-if="hasPokemons">
          <v-card
            v-for="(pokemon, index) in paginatedPokemonsOwned"
            :key="index"
            width="230px"
            class="ms-4 mb-4 .d-inline-block"
          >
            <v-img text-center max-width="300" :src="pokemon.img"> </v-img>
            <router-link :to="`/pokemon/${pokemon.id}`">
              <v-card-title>{{ pokemon.type.toUpperCase() }}</v-card-title>
            </router-link>

            <v-card-text class="pb-0">Número: {{ pokemon.id }}</v-card-text>

            <v-card-actions>
              <v-btn color="red" text @click="sellPokemonOwned(pokemon.id)">
                Vender
              </v-btn>
              <v-btn color="purple" text> Evolucionar </v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </h1>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapState } from "vuex";
import pokemonPage from "./pokemonPage.vue";
export default {
  name: "coleccion",
  components: {
    pokemonPage
  },

  computed: {
    ...mapState(["pokemonsOwned", "coins"]),
  },

  data() {
    return {
      pokemon: {},
      hasPokemons: false,
      itemsPerPage: 14,
      page: 1,
    };
  },
  methods: {
    incrementCoins(amount) {
      store.commit("incrementCoins", amount);
    },

    sellPokemonOwned(id) {
      this.$store.dispatch("removePokemon", id);
      this.incrementCoins(20);
    },
  },
  created: function () {
    let hasPokemons = JSON.parse(localStorage.getItem("pokemonsOwned"));
    if (hasPokemons === null) {
      this.hasPokemons = false;
    } else {
      this.hasPokemons = true;
    }
  },
  computed: {
    ...mapState(["pokemonsOwned", "coins"]),
    pages() {
      return Math.ceil(this.pokemonsOwned.length / this.itemsPerPage);
    },
    paginatedPokemonsOwned() {
      let start = (this.page - 1) * this.itemsPerPage;
      let end = start + this.itemsPerPage;
      return this.pokemonsOwned.slice(start, end);
    },
  },
};
</script>
