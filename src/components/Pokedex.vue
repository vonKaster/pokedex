<template>
  <div class="container text-center">
    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" class="" :src="pokemon.img"> </v-img>
      
      <div v-if="OpenButtonInfoClicked === true">
        <v-card-title>{{ pokemon.name.toUpperCase() }}</v-card-title>
        <v-card-text class="pb-0">Número: {{ pokemon.id }} </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="hasSaved === true"
            color="green"
            @click="
              guardarPokemon();
              hasClicked();
            "
            text
          >
            Guardar
          </v-btn>
          <v-btn color="red" text> Vender </v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <v-btn
      :disabled="disabled"
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
import axios from "axios";
export default {
  name: "Pokedex",

  data() {
    return {
      disabled: false,
      timeout: null,
      OpenButtonInfo: "Abrir",
      OpenButtonInfoClicked: false,
      hasSaved: false,
      counter: "5",
      hasPokemons: false,
      pokemonsOwned: [
        {
          id: "",
          name: "",
          img: "",
        },
      ],
      pokemon: {
        id: " ",
        name: "",
        img: "https://www.pngitem.com/pimgs/m/580-5807856_pokemon-pokeball-pokeball-transparent-background-hd-png-download.png",
      },
    };
  },

  methods: {
    obtenerPokemon(id) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => {
          console.log(response);
          this.pokemon.img = response.data.sprites.front_default;
          this.pokemon.name = response.data.name;
          this.pokemon.id = response.data.id;
          this.hasSaved = false;
          this.OpenButtonInfoClicked = true;
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
        this.disabled = true;
        this.OpenButtonInfo = this.counter;
        this.timeout = setTimeout(() => {
          this.disabled = false;
          this.counter--;
          this.countDown();
        }, 1000);
      } else {
        this.disabled = false;
        this.counter = 5;
        this.OpenButtonInfo = "Abrir";
      }
    },
    delay() {
      this.disabled = true;
      this.countDown();
      this.disabled = false;
    },
    guardarPokemon() {
      this.pokemonsOwned.push({
        id: this.pokemon.id,
        name: this.pokemon.name,
        img: this.pokemon.img,
      });
      localStorage.setItem("pokemonsOwned", JSON.stringify(this.pokemonsOwned));
      this.hasSaved = true;
      console.log(this.pokemonsOwned);
    },
    hasClicked() {
      this.OpenButtonInfoClicked = true;
    },
  },
  created: function () {
    let pokemonsOwned = JSON.parse(localStorage.getItem("pokemonsOwned"));
    if (pokemonsOwned === null) {
      this.pokemonsOwned = [];
    } else {
      this.pokemonsOwned = pokemonsOwned;
    }
  },
};
</script>
