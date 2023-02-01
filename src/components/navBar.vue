<template>
    <div>
        <v-toolbar>
  <!-- Adjust the height to your needs, mine is 40 -->
  <img class="mr-4" :src="require('../assets/img/pokedex.png')" height="50"/>
  <v-toolbar-title>Pokemonedas: </v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items>
    <v-btn text :to="{name: 'home'}">Abrir cajas</v-btn>
    <v-btn text :to="{name: 'coleccion'}">Mi colección</v-btn>
  </v-toolbar-items>
</v-toolbar>
    </div>
  </template>

<script>
name: "navBar";
export default {};
</script>
