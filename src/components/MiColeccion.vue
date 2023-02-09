<template>
  <div class="container">
    <div class="container">
      <h2 v-if="!hasPokemons" class="text-center">
        Aún no tienes ningún pokemon
      </h2>

      <v-text-field v-if="hasPokemons"
        label="BUSCAR POR NOMBRE O TIPO"
        v-model="name"
        @input="filterPokemons(name)"
        class="search"
      ></v-text-field>

      <div class="d-flex flex-wrap" v-if="hasPokemons">
        <v-card
          v-for="(pokemon, index) in paginatedPokemonsOwned"
          :key="index"
          width="275px"
          class="ms-4 mb-4 .d-inline-block"
        >
          <v-img text-center max-width="300" :src="pokemon.img"> </v-img>

          <v-card-title>
            <v-dialog
              persistent
              transition="dialog-top-transition"
              max-width="600"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                  "
                >
                  <span
                    style="
                      flex: 1;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ pokemon.name.toUpperCase() }}</span
                  >
                  <v-btn color="primary" v-bind="attrs" v-on="on"
                    ><v-icon color="black">mdi-pencil</v-icon></v-btn
                  >
                </div>
              </template>

              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="warning" dark
                    >¡Cambia el nombre de
                    {{ pokemon.name.toUpperCase() }}!</v-toolbar
                  >
                  <v-card-text>
                    <div class="text-h6 pa-12 text-center">
                      Necesitarás 20 monedas para realizar el cambio
                    </div>
                  </v-card-text>
                  <v-text-field
                    v-on:keyup.enter="
                      updatePokemonName(pokemon.uid, newName),
                        (dialog.value = !canClose)
                    "
                    style="width: 90%"
                    v-model="newName"
                    :label="pokemon.name.toUpperCase()"
                    :error-messages="nameError"
                    :rules="[
                      (v) =>
                        v.length >= 3 ||
                        'El nombre debe tener al menos 3 caracteres',
                    ]"
                    outlined
                    class="ma-auto"
                  ></v-text-field>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Cerrar</v-btn>
                    <v-btn
                      text
                      @click="
                        updatePokemonName(pokemon.uid, newName),
                          (dialog.value = !canClose)
                      "
                      >Cambiar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-card-title>

          <v-snackbar v-model="snackbar">
            {{ textSnackBar }}

            <template v-slot:action="{ attrs }">
              <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>

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
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapState, mapActions } from "vuex";
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
      itemsPerPage: 14,
      page: 1,
      editedPokemonName: "",
      name: "",
      newName: "",
      nameError: [],
      dialog: false,
      canClose: false,
      filteredPokemonsOwned: [],
      snackbar: false,
      textSnackBar: ``,
    };
  },
  methods: {
    ...mapActions(['decrementCoins', 'incrementCoins']),

    sellPokemonOwned(uid) {
      this.$store.dispatch("removePokemon", uid);
      this.incrementCoins(20);
      this.filteredPokemonsOwned = this.pokemonsOwned;
    },
    updatePokemonName(uid, name) {
      if (name.length >= 3) {
        if (this.coins >= 20) {
          let pokemon = this.pokemonsOwned.find(
            (pokemon) => pokemon.uid === uid
          );
          pokemon.name = name;
          store.dispatch("editPokemon", { uid, name });
          this.decrementCoins(20);
          this.canClose = true;
          this.filterPokemons();
          this.newName = "";
        } else {
          this.textSnackBar = "¡No tienes suficientes monedas!";
          this.snackbar = true;
        }
      } else {
        console.log(this.canClose);
        this.canClose = false;
        this.nameError = ["El nombre debe tener al menos 3 caracteres"];
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
    if (hasPokemons === null || hasPokemons === undefined || hasPokemons.length < 1) {
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
.search {
  width: 500px;
}
a {
  text-decoration: none;
}

.v-btn {
  padding: 0px 8px 0px 8px !important;
}

.v-card__text {
  padding: 0 !important;
}
</style>
