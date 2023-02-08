<template>
  <div class="container">
    <div class="container">
      <v-btn @click="$router.go(-1)"
        ><v-icon color="black">mdi-chevron-left</v-icon></v-btn
      >
      <div class="mt-4 d-flex flex-wrap justify-center">
        <v-card width="500px" class="ms-4 mb-4 d-flex flex-column">
          <v-img class="ma-auto" text-center min-width="300" :src="pokemon.img">
          </v-img>

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
          <br />
        </v-card>
      </div>
      <div class="d-flex justify-center">
          <v-card
            v-for="(stat, index) in pokemon.stats"
            :key="index"
            :style="{
              width: '180px',
              height: '110px',
              margin: '5px',
            }"
          >
            <v-icon
              class="d-flex justify-center mt-2"
              :size="50"
              :color="colors[index]"
              >{{ icons[index] }}</v-icon
            >
            <h4 class="text-center mt-2">
              {{ stat.stat.name.toUpperCase() }}: {{ stat.base_stat }}
            </h4>
          </v-card>
        </div>
    </div>
    <div class="d-flex justify-center">
      <v-card
        v-for="(ability, index) in abilities"
        :key="index"
        :style="{
          width: '400px',
          height: '160px',
          margin: '5px',
        }"
      >
        <v-icon class="d-flex justify-center mt-2" :size="50" color="indigo"
          >mdi-star-four-points-outline mdi-rotate-45</v-icon
        >
        <h2 class="text-center">{{ getName(ability) }}</h2>
        <p class="text-center">{{ getDescription(ability) }}</p>
      </v-card>
    </div>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapActions, mapState } from "vuex";
import axios from "axios";
export default {
  name: "pokemonPage",
  computed: {
    ...mapState(["pokemonsOwned", "coins"]),

  },
  data() {
    return {
      pokemon: null,
      colors: ["red", "orange", "yellow", "green", "blue", "purple"],
      abilities: [],
      snackbar: false,
      textSnackBar: ``,
      canClose: false,
      newName: "",
      nameError: [],
      icons: [
        "mdi-heart",
        "mdi-sword",
        "mdi-security",
        "mdi-flash",
        "mdi-shield-key",
        "mdi-lightning-bolt",
      ],
    };
  },
  created() {
    this.pokemon = this.pokemonsOwned.find(
      (pokemon) => pokemon.uid === parseInt(this.$route.params.uid)
    );
    console.log(this.pokemonsOwned);
  },

  methods: {
    ...mapActions(['incrementCoins', 'decrementCoins']),
    getName(ability) {
      for (let i = 0; i < ability.names.length; i++) {
        if (ability.names[i].language.name === "es") {
          return ability.names[i].name;
        }
      }
    },
    getDescription(ability) {
      for (let i = 0; i < ability.flavor_text_entries.length; i++) {
        if (ability.flavor_text_entries[i].language.name === "es") {
          return ability.flavor_text_entries[i].flavor_text;
        }
      }
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
          this.newName = null;
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
  },

  mounted() {
    this.pokemon.abilities.forEach(async (ability) => {
      try {
        const response = await axios.get(ability.ability.url);
        this.abilities.push(response.data);
        console.log(this.abilities);
      } catch (error) {
        console.error(error);
      }
    });
  },
};
</script>
