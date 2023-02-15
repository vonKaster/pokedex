<template>
    <v-footer color="indigo" padless>
      <v-col
        class="text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong><a target="_blank" href="https://github.com/vonKaster">vonKaster</a> (Front-End Rookie for Digicard)</strong>
      </v-col>
    </v-footer>
  </template>
<script>
export default {

}
</script>

<style>

a {
    color: #34D1BF!important;
    text-decoration: none;
}

</style>