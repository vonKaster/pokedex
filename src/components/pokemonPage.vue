<template>
    <div>
      <h2>{{ pokemon.name.toUpperCase() }}</h2>
      <img :src="pokemon.img" />
      <p>Número: {{ pokemon.id }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "PokemonPage",
    props: ["id"],
    computed: {
      pokemon() {
        return this.$store.state.pokemonsOwned.find(p => p.id === this.id);
      },
    },
  };
  </script>
  