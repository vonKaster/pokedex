<template>
  <div class="container text-center">
    <v-card class="mx-auto" max-width="350px">
      <v-img text-center max-width="350" class="" :src="pokemon.img"> </v-img>

      <div>
        <v-card-title style="font-family: 'Merienda', cursive; font-size: 24px">{{ pokemon.type.toUpperCase() }}</v-card-title>
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
            color="orange"
            text
            :disabled="hasSelled === true"
            @click="sellPokemonNotOwned()"
          >
            permitir escape
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
      color="indigo"
      large
      :disabled="OpenButtonDisabled"
      @click="
        obtenerPokemon(getRandomInt());
        startTimer();
      "
      class="mt-4 white--text"
      >{{ OpenButtonInfo }}</v-btn
    >
    <v-snackbars bottom right :objects.sync="snackBarAlerts">
      <template v-slot:action="{ close }">
        <v-btn text @click="close()">Cerrar</v-btn>
      </template>
    </v-snackbars>
  </div>
</template>

<script>
import store from "@/store/index.js";
import axios from "axios";
import { mapState, mapActions, mapMutations } from "vuex";
import VSnackbars from "v-snackbars";
export default {
  name: "Pokedex",
  components: { "v-snackbars": VSnackbars },

  created(){
    document.title = "Pokédex | Inicio"
  },

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
      snackBarAlerts: [],
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
    ...mapMutations(["updateCoins", "updatePokeballs"]),

    startTimer() {
      this.OpenButtonDisabled = true;
      let countdown = setInterval(() => {
        this.setTimer(this.timer - 1);
        this.OpenButtonInfo = this.timer;
        if (this.OpenButtonInfo === 0) {
          clearInterval(countdown);
          this.setTimer(10);
          this.OpenButtonDisabled = false;
          this.OpenButtonInfo = "Abrir";
        }
      }, 1000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(countdown);
      });
    },

    obtenerPokemon(id) {
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
          localStorage.setItem(
            "pokemonsOwned",
            JSON.stringify(this.pokemonsOwned)
          );
          localStorage.setItem("coins", this.coins);
          localStorage.setItem("pokeballs", JSON.stringify(this.pokeballs));
        })
        .catch((error) => {
          this.pokemon.type = "No existe";
        });
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
        this.snackBarAlerts.push({
          message: "Selecciona una pokebola para atrapar al Pokémon",
          color: "red",
          timeout: 5000,
        });
        return;
      }

      const localPokeballs = JSON.parse(localStorage.getItem("pokeballs"));
      if (!localPokeballs[selectedBall]) {
        this.snackBarAlerts.push({
          message: `No tienes pokebolas ${selectedBall.toUpperCase()}`,
          color: "red",
          timeout: 5000,
        });
        return;
      }

      const caught = Math.random() < probability;
      if (!caught) {
        localPokeballs[selectedBall]--;
        localStorage.setItem("pokeballs", JSON.stringify(localPokeballs));
        this.updateBalls();
        this.snackBarAlerts.push({
          message: `No pudiste atrapar a ${this.pokemon.name.toUpperCase()} con la pokebola ${selectedBall.toUpperCase()}`,
          color: "red",
          timeout: 5000,
        });
        return;
      }

      store.dispatch("addPokemon", {
        uid: (this.pokemonsOwned[this.pokemonsOwned.length - 1]?.uid + 1) || 1,
        id: this.pokemon.id,
        name: this.pokemon.name,
        type: this.pokemon.type,
        img: this.pokemon.img,
        stats: this.pokemon.stats,
        abilities: this.pokemon.abilities,
        caughtWith: selectedBall,
      });
      localPokeballs[selectedBall]--;
      store.dispatch("setPokeballs", localPokeballs);
      this.updateBalls();
      this.snackBarAlerts.push({
        message: `Felicidades, atrapaste a ${this.pokemon.name.toUpperCase()} con una pokebola ${selectedBall.toUpperCase()}`,
        color: "green",
        timeout: 5000,
      });
      this.hasSaved = true;
      this.hasSelled = true;
    },

    async sellPokemonNotOwned() {
      store.dispatch("removePokemon", this.pokemon.id);
      this.incrementCoins(20);
      this.hasSelled = true;
      this.snackBarAlerts.push({
        message: `¡Dejaste Escapar a un ${this.pokemon.name.toUpperCase()}! | [+20 Pokemonedas]`,
        color: "green",
        timeout: 5000,
      });
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
        this.incrementCoins(200);
        localStorage.setItem(
          "pokeballs",
          JSON.stringify({ normal: 5, super: 3, ultra: 2, master: 1 })
        );
        localStorage.setItem("givedStartStuff", true);
        location.reload();
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

    if (this.timer <= 9) {
      this.OpenButtonDisabled = true;
      let countdown = setInterval(() => {
        this.setTimer(this.timer - 1);
        this.OpenButtonInfo = this.timer;
        if (this.OpenButtonInfo === 0) {
          clearInterval(countdown);
          this.setTimer(10);
          this.OpenButtonDisabled = false;
          this.OpenButtonInfo = "Abrir";
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
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@700&display=swap");
</style>

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
