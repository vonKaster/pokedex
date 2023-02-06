<template>
  <div class="pokemon-page">
    <h2>{{ pokemon.type.toUpperCase() }}</h2>
    <img :src="pokemon.img" />
    <p>Número: {{ pokemon.id }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "pokemonPage",
  computed: {
    ...mapState(["pokemonsOwned"]),
  },
  data() {
    return {
      pokemon: null,
    };
  },
  created () {
  this.pokemon = this.pokemonsOwned.find((pokemon) => pokemon.id === parseInt(this.$route.params.id));
  console.log(this.pokemonsOwned);
  },
};
</script>