<template>
  <div class="container text-center">
    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" class="" :src="pokemon.img"> </v-img>

      <div>
        <v-card-title>{{ pokemon.type.toUpperCase() }}</v-card-title>
        <v-card-text class="pb-0 text-left ms-4"
          >Número: {{ pokemon.id }}
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="hasSaved === true || hasSelled === true"
            color="green"
            @click="savePokemon()"
            text
          >
            Atrapar
          </v-btn>
          <v-btn
            color="red"
            text
            :disabled="hasSelled === true"
            @click="sellPokemonNotOwned()"
          >
            Vender
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <div class="d-flex mt-3 justify-center">
      <v-img
        v-for="ball in balls"
        :key="ball.name"
        :src="ball.src"
        max-width="50px"
        @click="selectBall(ball)"
        :class="{ selected: ball.selected}"
        class="ms-3"
      />
    </div>

    <v-btn
      :disabled="OpenButtonDisabled"
      @click="
        obtenerPokemon(getRandomInt());
        startTimer();
      "
      class="mt-4"
      >{{ OpenButtonInfo }}</v-btn
    >

    <v-snackbar v-model="snackbar">
      {{ textSnackBar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import store from "@/store/index.js";
import axios from "axios";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Pokedex",

  data() {
    return {
      OpenButtonDisabled: false,
      timeout: null,
      OpenButtonInfo: "Abrir",
      hasSaved: true,
      hasSelled: true,
      counter: "5",
      hasPokemons: false,
      multiLine: true,
      snackbar: false,
      hasPaided: false,
      textSnackBar: ``,
      pokemon: {
        uid: 1,
        id: 1,
        name: "Sin nombre",
        type: "¡Abre una pokebola!",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png",
        stats: [],
        abilities: [],
      },
      balls: [
        {
          name: "Normal",
          src: 'https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png',
          selected: false,
        },
        {
          name: "Super",
          src: 'https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png',
          selected: false,
        },
        {
          name: "Ultra",
          src: 'https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png',
          selected: false,
        },
        {
          name: "Master",
          src: 'https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png',
          selected: false,
        },
      ],
    };
  },

  computed: {
    ...mapState({
      timer: (state) => state.timer,
      pokemonsOwned: (state) => state.pokemonsOwned,
      coins: (state) => state.coins,
      pokeballs: (state) => state.pokeballs,
    }),
  },

  methods: {
    ...mapActions(["setTimer", "decrementCoins", "incrementCoins"]),
    ...mapMutations(["updateCoins"]),

    startTimer() {
      if (this.hasPaided === true) {
        this.OpenButtonDisabled = true;
        let countdown = setInterval(() => {
          this.setTimer(this.timer - 1);
          this.OpenButtonInfo = this.timer;
          if (this.OpenButtonInfo === 0) {
            clearInterval(countdown);
            this.setTimer(30);
            this.OpenButtonDisabled = false;
            this.OpenButtonInfo = "Abrir";
            this.hasPaided = false;
          }
        }, 1000);

        this.$once("hook:beforeDestroy", () => {
          clearInterval(countdown);
        });
      }
    },

    obtenerPokemon(id) {
      if (this.coins >= 10) {
        this.decrementCoins(10);
        this.hasPaided = true;
      }
      if (this.hasPaided === true) {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then((response) => {
            this.pokemon.img = response.data.sprites.front_default;
            this.pokemon.type = response.data.name;
            this.pokemon.id = response.data.id;
            this.pokemon.stats = response.data.stats;
            this.pokemon.abilities = response.data.abilities;
            this.pokemon.name = this.pokemon.type;
            this.saveLastPokemonRolled();
            this.hasSaved = false;
            this.hasSelled = false;
            localStorage.setItem("coins", this.coins);
          })
          .catch((error) => {
            this.pokemon.type = "No existe";
          });
      } else {
        this.textSnackBar = "¡No tenes suficientes monedas!";
        this.snackbar = true;
        this.hasPaided = false;
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * 906);
    },
    async savePokemon() {
      await this.$store.dispatch("addPokemon", {
        uid: this.pokemonsOwned.length + 1,
        id: this.pokemon.id,
        name: this.pokemon.name,
        stats: this.pokemon.stats,
        abilities: this.pokemon.abilities,
        type: this.pokemon.type,
        img: this.pokemon.img,
      });
      this.hasSaved = true;
      this.snackbar = true;
      this.textSnackBar = "¡Pokemon atrapado con éxito";
    },
    async sellPokemonNotOwned() {
      this.$store.dispatch("removePokemon", this.pokemon.uid);
      this.incrementCoins(20);
      this.hasSelled = true;
    },
    saveLastPokemonRolled() {
      store.commit("updateLastPokemonRolled", {
        id: this.pokemon.id,
        type: this.pokemon.type,
        img: this.pokemon.img,
      });
    },
    giveStartCoins() {
      let startCoins = localStorage.getItem("coins");
      let givedStartCoins = localStorage.getItem("givedStartCoins");
      if (
        startCoins === null ||
        (startCoins === undefined && givedStartCoins === false)
      ) {
        this.incrementCoins(40);
        localStorage.setItem("givedStartCoins", true);
      }
    },

    selectBall(ball) {
      this.balls.forEach((b) => { b.selected = false });
      ball.selected = true;
    },
  },

  mounted() {
    this.giveStartCoins();

    if (this.timer <= 29) {
      this.OpenButtonDisabled = true;
      let countdown = setInterval(() => {
        this.setTimer(this.timer - 1);
        this.OpenButtonInfo = this.timer;
        if (this.OpenButtonInfo === 0) {
          clearInterval(countdown);
          this.setTimer(30);
          this.OpenButtonDisabled = false;
          this.OpenButtonInfo = "Abrir";
          this.hasPaided = false;
        }
      }, 1000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(countdown);
      });
    }

    let LastPokemon_LS = JSON.parse(localStorage.getItem("lastPokemon"));

    if (LastPokemon_LS === null || LastPokemon_LS === undefined) {
      let pokemon = {
        id: 1,
        type: "¡Abre una pokebola!",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png",
      };
      localStorage.setItem("lastPokemon", JSON.stringify(pokemon));
    } else {
      this.pokemon.id = LastPokemon_LS.id;
      this.pokemon.name = LastPokemon_LS.name;
      this.pokemon.type = LastPokemon_LS.type;
      this.pokemon.img = LastPokemon_LS.img;
      this.pokemon.stats = LastPokemon_LS.stats;
      this.pokemon.abilities = LastPokemon_LS.abilities;
    }

  },
};
</script>

<style>
.selected {
  border: 2px solid blue;
  border-radius: 25px;
}

.disabled {
  opacity: 0.5;
  filter: grayscale(100%);
}
</style>
