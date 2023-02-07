<template>
  <div class="container">
      <div class="container">
        <v-btn @click="$router.go(-1)">Volver</v-btn>
        <div class="d-flex flex-wrap justify-center">
          <v-card
            :key="index"
            width="500px"
            class="ms-4 mb-4 d-flex flex-column"
          >
            <v-img class="ma-auto" text-center min-width="300" :src="pokemon.img"> </v-img>

            <v-card-title>
              <v-dialog
                persistent
                transition="dialog-top-transition"
                max-width="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      width: 100%;
                    "
                  >
                    <span
                      style="
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                      >{{ pokemon.name.toUpperCase() }}</span
                    >
                    <v-btn color="primary" v-bind="attrs" v-on="on"
                      ><v-icon color="black">mdi-pencil</v-icon></v-btn
                    >
                  </div>
                </template>

                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="warning" dark
                      >¡Cambia el nombre de
                      {{ pokemon.name.toUpperCase() }}!</v-toolbar
                    >
                    <v-card-text>
                      <div class="text-h6 pa-12 text-center">
                        Necesitarás 20 monedas para realizar el cambio
                      </div>
                    </v-card-text>
                    <v-text-field
                      v-model="newName"
                      :label="pokemon.name.toUpperCase()"
                      :error-messages="nameError"
                      :rules="[
                        (v) =>
                          v.length >= 3 ||
                          'El nombre debe tener al menos 3 caracteres',
                      ]"
                      outlined
                      class="ma-auto"
                    ></v-text-field>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Cerrar</v-btn>
                      <v-btn
                        text
                        @click="
                          updatePokemonName(pokemon.uid, newName),
                            (dialog.value = canClose)
                        "
                        >Cambiar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-card-title>

            <v-card-text class="ms-4">ID: {{ pokemon.uid }}</v-card-text>
            <v-card-text class="ms-4"
              >Tipo: {{ pokemon.type.toUpperCase() }}</v-card-text
            >
            <v-card-text class="ms-4">Número: {{ pokemon.id }}</v-card-text>
          </v-card>
        </div>
      </div>
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
  this.pokemon = this.pokemonsOwned.find((pokemon) => pokemon.uid === parseInt(this.$route.params.uid));
  console.log(this.pokemonsOwned);
  },
};
</script>