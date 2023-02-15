<template>
  <div class="container">
    <div class="container">
      <h2 v-if="!hasPokemons" class="text-center">No tenés ningún pokemon</h2>

      <v-text-field
        v-if="hasPokemons"
        label="BUSCAR POR NOMBRE O TIPO"
        v-model="name"
        @input="filterPokemons(name)"
        class="search"
      ></v-text-field>

      <div class="d-flex flex-wrap" v-if="hasPokemons">
        <v-card
          v-for="(pokemon, index) in paginatedPokemonsOwned"
          :key="index"
          :width="$vuetify.breakpoint.smAndDown ? '80%' : '270px'"
          :class="{
            'mx-auto mb-4 .d-inline-block': $vuetify.breakpoint.smAndDown,
            'ms-4 mb-4 .d-inline-block': !$vuetify.breakpoint.smAndDown,
          }"
        >
          <router-link :to="`/pokemon/${pokemon.uid}`">
            <v-img text-center max-width="300" :src="pokemon.img" />
          </router-link>
          <v-divider />

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
                    style="font-family: 'Merienda', cursive; font-size: 24px"
                    >{{ pokemon.name }}</span
                  >
                  <v-btn
                    class="ma-2"
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    small
                    fab
                    color="indigo"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </template>

              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="indigo" dark
                    >¡Cambia el nombre de
                    {{ pokemon.name.toUpperCase() }}!</v-toolbar
                  >
                  <v-card-text>
                    <div class="text-h6 pa-6 text-center text--black">
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
                      (v) =>
                        v.length < 13 ||
                        'El nombre puede contener como máximo 12 caracteres',
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

          <v-card-text class="ms-4">ID: {{ pokemon.uid }}</v-card-text>
          <v-card-text class="ms-4"
            >Tipo: {{ pokemon.type.toUpperCase() }}</v-card-text
          >
          <v-card-text class="ms-4">Número: {{ pokemon.id }}</v-card-text>

          <v-card-actions>
            <v-btn
              color="error"
              width="100%"
              @click="sellPokemonOwned(pokemon.uid, pokemon.name)"
              class="mx-auto mt-2"
            >
              Vender
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </div>
    <v-snackbars bottom right :objects.sync="snackBarAlerts">
      <template v-slot:action="{ close }">
        <v-btn text @click="close()">Cerrar</v-btn>
      </template>
    </v-snackbars>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapState, mapActions } from "vuex";
import pokemonPage from "./pokemonPage.vue";
import VSnackbars from "v-snackbars";
export default {
  name: "coleccion",
  components: {
    pokemonPage,
    "v-snackbars": VSnackbars,
  },

  computed: {
    ...mapState(["pokemonsOwned", "coins"]),
  },

  data() {
    return {
      pokemon: {},
      hasPokemons: false,
      itemsPerPage: 12,
      page: 1,
      editedPokemonName: "",
      name: "",
      newName: "",
      nameError: [],
      dialog: false,
      canClose: false,
      filteredPokemonsOwned: [],
      snackBarAlerts: [],
    };
  },
  methods: {
    ...mapActions(["decrementCoins", "incrementCoins"]),

    sellPokemonOwned(uid, name) {
      this.snackBarAlerts.push({
        message: "Vendiste a: " + name.toUpperCase() + " | [+100 Pokemonedas]",
        color: "green",
        timeout: 5000,
      });
      if (this.pokemonsOwned.length === 1) {
        this.hasPokemons = false;
      }
      store.dispatch("removePokemon", uid);
      this.incrementCoins(100);
      this.filteredPokemonsOwned = this.pokemonsOwned;
    },
    updatePokemonName(uid, name) {
      if (name.length >= 3 && name.length < 13) {
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
          this.snackBarAlerts.push({
            message: "¡No tienes suficientes monedas!",
            color: "red",
            timeout: 5000,
          });
        }
      } else if (name.length < 3) {
        this.canClose = false;
        this.nameError = ["El nombre debe tener al menos 3 caracteres"];
      } else if (name.length > 13) {
        this.canClose = false;
        this.nameError = ["El nombre debe tener como máximo 12 caracteres"];
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
    document.title = "Pokédex | Colección";
    let hasPokemons = JSON.parse(localStorage.getItem("pokemonsOwned"));
    if (
      hasPokemons === null ||
      hasPokemons === undefined ||
      hasPokemons.length < 1
    ) {
      this.hasPokemons = false;
    } else {
      this.hasPokemons = true;
    }
  },
  computed: {
    ...mapState(["pokemonsOwned", "coins"]),

    filteredPokemonsOwned() {
      if (this.name.length > 0) {
        return this.pokemonsOwned.filter(
          (pokemon) =>
            pokemon.name.includes(this.name) || pokemon.type.includes(this.name)
        );
      } else {
        return this.pokemonsOwned;
      }
    },

    paginatedPokemonsOwned() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPokemonsOwned.slice(start, end);
    },

    pages() {
      return Math.ceil(this.filteredPokemonsOwned.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.filteredPokemonsOwned = this.pokemonsOwned;
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@700&display=swap");
</style>

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
