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
      <div v-for="ball in balls" :key="ball.name">
        <h4 class="ms-3">{{ ball.amount }}</h4>
        <v-img
          :src="ball.src"
          max-width="50px"
          @click="selectBall(ball)"
          :class="{ selected: ball.selected }"
          class="ms-3"
        />
      </div>
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
        caughtWith: "",
      },
      balls: [
        {
          name: "normal",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "super",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "ultra",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "master",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png",
          selected: false,
          amount: 0,
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
    pokeLS() {
      return JSON.parse(localStorage.getItem("pokeballs"));
    },
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
            localStorage.setItem("pokeballs", JSON.stringify(this.pokeballs));
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
    savePokemon() {
      let selectedBall;
      let probability;

      this.balls.forEach((ball) => {
        if (ball.selected) {
          selectedBall = ball.name;
          switch (selectedBall) {
            case "normal":
              probability = 0.3;
              break;
            case "super":
              probability = 0.5;
              break;
            case "ultra":
              probability = 0.75;
              break;
            case "master":
              probability = 1;
              break;
            default:
              probability = 0;
          }
        }
      });

      if (!selectedBall) {
        this.textSnackBar = "Selecciona una pokebola para atrapar al Pokémon";
        this.snackbar = true;
        return;
      }

      const localPokeballs = JSON.parse(localStorage.getItem("pokeballs"));
      if (!localPokeballs[selectedBall]) {
        this.textSnackBar = `No tienes pokebolas ${selectedBall.toUpperCase()}`;
        this.snackbar = true;
        return;
      }

      const caught = Math.random() < probability;
      if (!caught) {
        this.textSnackBar = `No pudiste atrapar a ${this.pokemon.name.toUpperCase()} con la pokebola ${selectedBall.toUpperCase()}`;
        this.snackbar = true;
        return;
      }

      this.$store.dispatch("addPokemon", {
        uid: this.pokemonsOwned.length + 1,
        id: this.pokemon.id,
        name: this.pokemon.name,
        type: this.pokemon.type,
        img: this.pokemon.img,
        stats: this.pokemon.stats,
        abilities: this.pokemon.abilities,
        caughtWith: selectedBall,
      });
      localPokeballs[selectedBall]--;
      localStorage.setItem("pokeballs", JSON.stringify(localPokeballs));
      this.textSnackBar = `Felicidades, atrapaste a ${this.pokemon.name.toUpperCase()} con una pokebola ${selectedBall.toUpperCase()}`;
      this.snackbar = true;
      this.hasSaved = true;
      this.hasSelled = true;
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
    giveStartStuff() {
      let startCoins = localStorage.getItem("coins");
      let startPokeballs = localStorage.getItem("pokeballs");
      let givedStartStuff = localStorage.getItem("givedStartStuff");
      if (
        startCoins === null ||
        (startCoins === undefined &&
          givedStartCoins === false &&
          startPokeballs === null) ||
        (startPokeballs === undefined && startPokeballs === false)
      ) {
        this.incrementCoins(40);
        localStorage.setItem(
          "pokeballs",
          JSON.stringify({ normal: 5, super: 3, ultra: 2, master: 1 })
        );
        localStorage.setItem("givedStartStuff", true);
      }
      let givedStartPokeballs = localStorage.getItem("givedStartPokeballs");
    },

    selectBall(ball) {
      this.balls.forEach((b) => {
        b.selected = false;
      });
      ball.selected = true;
    },

    updateBalls() {
      const pokeLS = JSON.parse(localStorage.getItem("pokeballs"));
      this.balls = [
        {
          name: "normal",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png",
          selected: false,
          amount: pokeLS.normal !== undefined ? pokeLS.normal : 0,
        },
        {
          name: "super",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png",
          selected: false,
          amount: pokeLS.super !== undefined ? pokeLS.super : 0,
        },
        {
          name: "ultra",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png",
          selected: false,
          amount: pokeLS.ultra !== undefined ? pokeLS.ultra : 0,
        },
        {
          name: "master",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png",
          selected: false,
          amount: pokeLS.master !== undefined ? pokeLS.master : 0,
        },
      ];
    },
  },

  mounted() {
    this.giveStartStuff();
    this.updateBalls();

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

    console.log(this.pokeLS);
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
