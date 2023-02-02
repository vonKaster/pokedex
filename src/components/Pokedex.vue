<template>
  <div class="container text-center">
    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" class="" :src="pokemon.img"> </v-img>
      
      <div v-if="OpenButtonClicked === true">
        <v-card-title>{{ pokemon.name.toUpperCase() }}</v-card-title>
        <v-card-text class="pb-0 text-left">Número: {{ pokemon.id }} </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="hasSaved === true || hasSelled === true"
            color="green"
            @click="
              savePokemon();
              hasClicked();
            "
            text
          >
            Guardar
          </v-btn>
          <v-btn color="red" text :disabled="hasSelled === true" @click="sellPokemonNotOwned()"> Vender </v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <v-btn
      :disabled="OpenButtonDisabled"
      @click="
        obtenerPokemon(getRandomInt());
        countDown();
      "
      class="mt-4"
      >{{ OpenButtonInfo }}</v-btn
    >
  </div>
</template>

<script>
import store from '@/store/index.js'
import axios from "axios";
import { mapState, mapActions } from 'vuex';
export default {
  name: "Pokedex",

  data() {
    return {
      OpenButtonDisabled: false,
      timeout: null,
      OpenButtonInfo: "Abrir",
      OpenButtonClicked: false,
      hasSaved: false,
      hasSelled: false,
      counter: "5",
      hasPokemons: false,
      pokemon: {
        id: " ",
        name: "",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png",
      },
    };
  },

  computed: {
    ...mapState(['pokemonsOwned', 'coins'])
  },

  methods: {
    ...mapActions('addPokemon', 'removePokemon'),
    obtenerPokemon(id) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => {
          console.log(response);
          this.pokemon.img = response.data.sprites.front_default;
          this.pokemon.name = response.data.name;
          this.pokemon.id = response.data.id;
          this.hasSaved = false;
          this.hasSelled = false;
          this.OpenButtonClicked = true;
        })
        .catch((error) => {
          this.pokemon.name = "No existe";
        });
    },
    getRandomInt() {
      return Math.floor(Math.random() * 906);
    },
    countDown() {
      if (this.counter >= 0) {
        this.OpenButtonDisabled= true;
        this.OpenButtonInfo = this.counter;
        this.timeout = setTimeout(() => {
          this.OpenButtonDisabled = false;
          this.counter--;
          this.countDown();
        }, 1000);
      } else {
        this.OpenButtonDisabled = false;
        this.counter = 5;
        this.OpenButtonInfo = "Abrir";
      }
    },
    delay() {
      this.OpenButtonDisabled = true;
      this.countDown();
      this.OpenButtonDisabled = false;
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
    hasClicked() {
      this.OpenButtonClicked = true;
    },
    async sellPokemonNotOwned(){
      this.$store.dispatch('removePokemon', this.pokemon.id);
      this.incrementCoins();
      this.hasSelled = true;
    },
    incrementCoins() {
      store.commit('incrementCoins');
    }
  },
};
</script>
