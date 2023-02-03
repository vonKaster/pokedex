<template>
  <div class="container text-center">
    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" class="" :src="pokemon.img"> </v-img>

      <div>
        <v-card-title>{{ pokemon.name.toUpperCase() }}</v-card-title>
        <v-card-text class="pb-0 text-left"
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
            Guardar
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
  </div>
</template>

<script>
import store from "@/store/index.js";
import axios from "axios";
import { mapState, mapActions, mapGetters } from "vuex";
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
      pokemon: {
        id: "1",
        name: "¡Abre una pokebola!",
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
      this.OpenButtonDisabled = true;
      let countdown = setInterval(() => {
        this.setTimer(this.timer - 1)
        this.OpenButtonInfo = this.timer;
        if (this.OpenButtonInfo === 0) {
          clearInterval(countdown);
          this.setTimer(30);
          this.OpenButtonDisabled = false;
          this.OpenButtonInfo = "Abrir";
        }
      }, 1000)

      this.$once("hook:beforeDestroy", () => {
        clearInterval(countdown);
      });
    },

    obtenerPokemon(id) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => {
          console.log(response);
          this.pokemon.img = response.data.sprites.front_default;
          this.pokemon.name = response.data.name;
          this.pokemon.id = response.data.id;
          this.saveLastPokemonRolled()
          this.hasSaved = false;
          this.hasSelled = false;
        })
        .catch((error) => {
          this.pokemon.name = "No existe";
        });
    },
    getRandomInt() {
      return Math.floor(Math.random() * 906);
    },
    async savePokemon() {
      await this.$store.dispatch("addPokemon", {
        id: this.pokemon.id,
        name: this.pokemon.name,
        img: this.pokemon.img,
      });
      this.hasSaved = true;
      console.log(this.pokemonsOwned);
    },
    async sellPokemonNotOwned() {
      this.$store.dispatch("removePokemon", this.pokemon.id);
      this.incrementCoins();
      this.hasSelled = true;
    },
    incrementCoins() {
      store.commit("incrementCoins");
    },
    saveLastPokemonRolled(){
      store.commit("updateLastPokemonRolled", {
        id: this.pokemon.id,
        name: this.pokemon.name,
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
        }
      }, 1000)
    }

    let ls = JSON.parse(localStorage.getItem("lastPokemon"));

    if(ls === null || ls === undefined) {
      let pokemon = {
        id: 1,
        name: "¡Abre una pokebola!",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png"
      }
      localStorage.setItem("lastPokemon", JSON.stringify(pokemon));
    } else {
      this.pokemon.id = ls.id;
      this.pokemon.name = ls.name;
      this.pokemon.img = ls.img;
    }

  },

};
</script>
