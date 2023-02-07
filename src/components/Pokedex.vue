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
            @click="
              savePokemon();
            "
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
    <v-btn
      :disabled="OpenButtonDisabled"
      @click="
        obtenerPokemon(getRandomInt());
        startTimer();
      "
      class="mt-4"
      
      >{{ OpenButtonInfo }}</v-btn
    >

    <v-snackbar
      v-model="snackbar"
    >
      {{ textSnackBar }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import store from "@/store/index.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
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
        name: 'Sin nombre',
        type: "¡Abre una pokebola!",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png",
      },
    };
  },

  computed: {
    ...mapState({
      timer: state => state.timer,
      pokemonsOwned: state => state.pokemonsOwned,
      coins: state => state.coins
    })
  },

  methods: {
    ...mapActions(['setTimer']),

    startTimer() {

      if(this.hasPaided === true) {
        this.OpenButtonDisabled = true;
        let countdown = setInterval(() => {
          this.setTimer(this.timer - 1)
          this.OpenButtonInfo = this.timer;
          if (this.OpenButtonInfo === 0) {
            clearInterval(countdown);
            this.setTimer(30);
            this.OpenButtonDisabled = false;
            this.OpenButtonInfo = "Abrir";
            this.hasPaided = false;
          }
        }, 1000)
  
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
      if (this.hasPaided === true){
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then((response) => {
            console.log(response);
            this.pokemon.img = response.data.sprites.front_default;
            this.pokemon.type = response.data.name;
            this.pokemon.id = response.data.id;
            this.pokemon.name = 'Sin nombre';
            this.saveLastPokemonRolled()
            this.hasSaved = false;
            this.hasSelled = false;
          })
          .catch((error) => {
            this.pokemon.type = "No existe";
          });
      } else {
        this.textSnackBar = "¡No tienes suficientes monedas!"
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
        type: this.pokemon.type,
        img: this.pokemon.img,
      });
      this.hasSaved = true;
      this.snackbar = true;
      this.textSnackBar = "Pokemon guardado exitosamente";
    },
    async sellPokemonNotOwned() {
      this.$store.dispatch("removePokemon", this.pokemon.id);
      this.incrementCoins(20);
      this.hasSelled = true;
    },
    incrementCoins(amount) {
      store.commit("incrementCoins", amount);
    },
    decrementCoins(amount) {
      store.commit("decrementCoins", amount);
    },
    saveLastPokemonRolled(){
      store.commit("updateLastPokemonRolled", {
        id: this.pokemon.id,
        type: this.pokemon.type,
        img: this.pokemon.img,
      });
    }
  },

  mounted(){
    if (this.timer <= 29){
      this.OpenButtonDisabled = true;
        let countdown = setInterval(() => {
          this.setTimer(this.timer - 1)
          this.OpenButtonInfo = this.timer;
          if (this.OpenButtonInfo === 0) {
            clearInterval(countdown);
            this.setTimer(30);
            this.OpenButtonDisabled = false;
            this.OpenButtonInfo = "Abrir";
            this.hasPaided = false;
          }
        }, 1000)
  
        this.$once("hook:beforeDestroy", () => {
          clearInterval(countdown);
        });
    }

    let ls = JSON.parse(localStorage.getItem("lastPokemon"));

    if(ls === null || ls === undefined) {
      let pokemon = {
        id: 1,
        type: "¡Abre una pokebola!",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png"
      }
      localStorage.setItem("lastPokemon", JSON.stringify(pokemon));
    } else {
      this.pokemon.id = ls.id;
      this.pokemon.name = ls.name;
      this.pokemon.type = ls.type;
      this.pokemon.img = ls.img;
    }

  },

};
</script>
