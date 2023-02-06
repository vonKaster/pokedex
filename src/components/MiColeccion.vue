<template>
  <div class="container">
    <h1>
      <div class="container">
        <h2 v-if="!hasPokemons" class="text-center">
          Aún no tienes ningún pokemon
        </h2>

        <v-text-field
          label="BUSCAR POR NOMBRE O TIPO"
          v-model="name"
          @input="filterPokemons(name)"
          class="search"
        ></v-text-field>

        <div class="d-flex flex-wrap" v-if="hasPokemons">
          <v-card
            v-for="(pokemon, index) in paginatedPokemonsOwned"
            :key="index"
            width="230px"
            class="ms-4 mb-4 .d-inline-block"
          >
            <v-img text-center max-width="300" :src="pokemon.img"> </v-img>

            <v-card-title
              >{{ pokemon.name.toUpperCase() }}
              <v-icon>mdi-pencil</v-icon>
            </v-card-title>
            <v-card-text class="ms-4">ID: {{ pokemon.uid }}</v-card-text>
            <v-card-text class="ms-4"
              >Tipo: {{ pokemon.type.toUpperCase() }}</v-card-text
            >
            <v-card-text class="ms-4">Número: {{ pokemon.id }}</v-card-text>

            <v-card-actions>
              <router-link :to="`/pokemon/${pokemon.uid}`">
                <v-btn color="purple" text> Perfil </v-btn>
              </router-link>
              <v-btn color="red" text @click="sellPokemonOwned(pokemon.uid)">
                Vender
              </v-btn>
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
    pokemonPage,
  },

  computed: {
    ...mapState(["pokemonsOwned", "coins"]),
  },

  data() {
    return {
      pokemon: {},
      hasPokemons: false,
      itemsPerPage: 1,
      page: 1,
      editedPokemonName: "",
      name: "",
      filteredPokemonsOwned: [],
    };
  },
  methods: {
    incrementCoins(amount) {
      store.commit("incrementCoins", amount);
    },

    sellPokemonOwned(uid) {
      this.$store.dispatch("removePokemon", uid);
      this.incrementCoins(20);
    },
    updatePokemonName(uid, name) {
      if (name !== null) {
        let pokemon = this.pokemonsOwned.find((pokemon) => pokemon.uid === uid);
        pokemon.name = name;
        store.dispatch("editPokemon", { uid, name });
      }
    },
    filterPokemons(name) {
      if (!name) {
        this.filteredPokemonsOwned = this.pokemonsOwned;
        return;
      }

      this.filteredPokemonsOwned = this.pokemonsOwned.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(name.toLowerCase()) ||
          pokemon.type.toLowerCase().includes(name.toLowerCase())
      );
    },
  },

  watch: {
    search: function () {
      this.filterPokemons();
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
    paginatedPokemonsOwned() {
      return this.filteredPokemonsOwned.slice(this.start, this.end);
    },
  },
  mounted() {
    this.filteredPokemonsOwned = this.pokemonsOwned;
  },
};
</script>

<style>
.v-text-field {
  width: 150px;
}
.search {
  width: 500px;
}
a {
  text-decoration: none;
  margin-bottom: 5px !important;
}

.v-btn {
  padding: 0px 8px 0px 8px !important;
}

.v-input__slot {
  padding: 0 !important;
}

.v-card__text {
  padding: 0 !important;
}
</style>
