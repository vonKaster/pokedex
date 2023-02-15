<template>
  <div class="container">
    <div class="container">
      <v-btn @click="$router.go(-1)"
        ><v-icon color="black">mdi-chevron-left</v-icon></v-btn
      >
      <div class="mt-4 d-flex flex-wrap justify-center">
        <v-card width="500px" class="ms-4 mb-4 d-flex flex-column card">
          <v-img
            class="ma-auto pokemon-img"
            text-center
            min-width="300"
            :src="pokemon.img"
          >
          </v-img>
          <v-divider />

          <div class="test">
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
                    <h2 class="glow">{{ pokemon.name }}</h2>
                    <v-btn
                      class="ma-2"
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      small
                      fab
                      color="white"
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
                      <div class="text-h6 pa-6 text-center">
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
            <v-card-text class="ms-4 text-card"
              >ID: {{ pokemon.uid }}</v-card-text
            >
            <v-card-text class="ms-4 text-card"
              >Tipo: {{ pokemon.type.toUpperCase() }}</v-card-text
            >
            <v-card-text class="ms-4 text-card"
              >Número: {{ pokemon.id }}</v-card-text
            >
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-img
                  v-bind="attrs"
                  v-on="on"
                  class="ms-4 mt-4"
                  :src="returnCaughtWith()"
                  max-width="50px"
                />
              </template>
              <span
                >Pokémon atrapado con una pokebola
                {{ pokemon.caughtWith.toUpperCase() }}</span
              >
            </v-tooltip>
            <br />
          </div>
        </v-card>
      </div>
      <v-container fluid>
        <v-row justify="center">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(stat, index) in pokemon.stats"
            :key="index"
          >
            <v-card class="mx-auto" :style="{ width: '50%', margin: '5px' }">
              <v-icon
                class="d-flex justify-center mt-2"
                :size="50"
                :color="colors[index]"
              >
                {{ icons[index] }}
              </v-icon>
              <h4 class="text-center mt-2">
                {{ stat.stat.name.toUpperCase() }}: {{ stat.base_stat }}
              </h4>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(ability, index) in abilities"
            :key="index"
          >
            <v-card class="mx-auto" :style="{ width: '75%', margin: '5px' }">
              <v-icon
                class="d-flex justify-center mt-2"
                :size="50"
                color="indigo"
              >
                mdi-star-four-points-outline mdi-rotate-45
              </v-icon>
              <h2 class="text-center pa-2">{{ getName(ability) }}</h2>
              <p class="text-center pa-2">{{ getDescription(ability) }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbars bottom right :objects.sync="snackBarAlerts">
        <template v-slot:action="{ close }">
          <v-btn text @click="close()">Cerrar</v-btn>
        </template>
      </v-snackbars>
    </div>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapActions, mapState } from "vuex";
import axios from "axios";
import VSnackbars from "v-snackbars";
export default {
  name: "pokemonPage",
  components: { "v-snackbars": VSnackbars },
  computed: {
    ...mapState(["pokemonsOwned", "coins"]),
  },
  data() {
    return {
      pokemon: null,
      colors: ["red", "orange", "yellow", "green", "blue", "purple"],
      abilities: [],
      snackBarAlerts: [],
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
  },

  methods: {
    ...mapActions(["incrementCoins", "decrementCoins"]),
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
          this.snackBarAlerts.push({
          message: "¡No tenés suficentes monedas!",
          color: "red",
          timeout: 5000,
        });
        }
      } else {
        this.canClose = false;
        this.nameError = ["El nombre debe tener al menos 3 caracteres"];
      }
    },

    returnCaughtWith() {
      let caughtWith = this.pokemon.caughtWith;
      let src = "";
      switch (caughtWith) {
        case "normal":
          src =
            "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png";
          break;
        case "super":
          src =
            "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png";
          break;
        case "ultra":
          src =
            "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png";
          break;
        case "master":
          src =
            "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png";
          break;
      }
      return src;
    },
  },

  mounted() {
    this.pokemon.abilities.forEach(async (ability) => {
      try {
        const response = await axios.get(ability.ability.url);
        this.abilities.push(response.data);
      } catch (error) {
        console.error(error);
      }
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@700&display=swap");
</style>

<style>
.text-card {
  font-size: 16px;
  color: black !important;
}

.test {
  background-color: #3f51b5;
}

.text-card {
  color: white !important;
}

.glow {
  font-size: 35px !important;
  color: white;
  font-family: "Merienda", cursive;
  animation-name: glow;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes glow {
  from {
    text-shadow: 0px 0px 5px #fff, 0px 0px 5px #614ad3;
  }
  to {
    text-shadow: 0px 0px 20px #fff, 0px 0px 20px #614ad3;
  }
}
</style>
