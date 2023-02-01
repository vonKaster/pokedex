<template>
  <div class="container">
    <h1>
      <div class="container">
        <h2 v-if="!hasPokemons" class="text-center">
          Aún no tienes ningún pokemon
        </h2>

        <div class=" d-flex flex-wrap" v-if="hasPokemons">
          <v-card 
            v-for="(pokemon, index) in pokemonsOwned"
            :key="index"
            width="230px"
            class="ms-4 mb-4 .d-inline-block"

          >
            <v-img text-center max-width="300" :src="pokemon.img">
            </v-img>
            <v-card-title>{{ pokemon.name.toUpperCase() }}</v-card-title>

            <v-card-text class="pb-0">Número: {{ pokemon.id }}</v-card-text>

            <v-card-actions>
              <v-btn color="red" text> Vender </v-btn>
              <v-btn color="purple" text> Evolucionar </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </h1>
  </div>
</template>

<script>
export default {
  name: "coleccion",
  data() {
    return {
      pokemon: {},
      hasPokemons: false,
    };
  },
  created: function () {
    let pokemonsOwned = JSON.parse(localStorage.getItem("pokemonsOwned"));
    if (pokemonsOwned === null) {
      this.pokemonsOwned = [];
    } else {
      this.pokemonsOwned = pokemonsOwned;
    }

    let hasPokemons = JSON.parse(localStorage.getItem("pokemonsOwned"));
      if (hasPokemons === null) {
        this.hasPokemons = false
      } else {
        this.hasPokemons = true;
      }
  },
};
</script>
