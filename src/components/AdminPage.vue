<template>
  <div>
    <div class="centered-container">
      <v-form v-if="!isAuthenticated" @submit.prevent="submitPassword">
        <v-text-field
          outlined
          id="password-input"
          label="Contraseña"
          v-model="password"
          prepend-icon="mdi-key"
          type="password"
          class="login-textfield"
        ></v-text-field>
      </v-form>
      <div class="" v-if="isAuthenticated">
        <v-card class="mx-auto" max-width="300px">
          <v-img
            text-center
            max-width="300"
            class=""
            src="../assets/img/pokecoins.png"
          >
          </v-img>

          <div>
            <v-card-title>Monedas</v-card-title>
            <v-text-field
              v-model="amountCoins"
              outlined
              label="Cantidad"
              color="dark"
              class="card-textfield ms-4 p-0"
              type="number"
              @input="handleInput"
            ></v-text-field>
            <v-card-actions>
              <v-btn
                color="green"
                text
                :disabled="
                  amountCoins === null ||
                  amountCoins === 0 ||
                  isNaN(amountCoins)
                "
                @click="addCoins()"
              >
                Obtener
              </v-btn>
              <v-btn color="red" text @click="resetCoins()"> resetear </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>
      <div v-if="isAuthenticated">
        <v-card class="mx-auto ms-6" max-width="300px">
          <v-img
            text-center
            max-width="300"
            class=""
            src="../assets/img/pokeball_sell.png"
          >
          </v-img>

          <div>
            <v-card-title>Pokeballs</v-card-title>
            <v-select
              v-model="pokeballSelected"
              :items="items"
              outlined
              label="Tipo"
              required
              class="mx-auto"
            ></v-select>
            <v-text-field
              v-model="amountPokeballs"
              outlined
              label="Cantidad"
              color="dark"
              class="card-textfield ms-4 p-0"
              type="number"
              @input="handleInput"
            ></v-text-field>
            <div class="d-flex justify-center">
              <div v-for="ball in balls" :key="ball.name">
                <h4 class="ms-6">{{ ball.amount }}</h4>
                <v-img
                  :src="ball.src"
                  max-width="50px"
                  @click="selectBall(ball)"
                  :class="{ selected: ball.selected }"
                  class="ms-3"
                />
              </div>
            </div>
            <v-card-actions>
              <v-btn
                color="green"
                text
                :disabled="
                  pokeballSelected === null ||
                  amountPokeballs === null ||
                  amountPokeballs === 0 ||
                  isNaN(amountPokeballs)
                "
                @click="addPokeball(pokeballSelected, amountPokeballs)"
              >
                Obtener
              </v-btn>
              <v-btn color="red" text @click="resetPokeballs()"> resetear </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      password: "",
      isAuthenticated: false,
      amountCoins: null,
      amountPokeballs: null,
      pokeballSelected: null,
      items: ["normal", "super", "ultra", "master"],
      balls: [
        {
          name: "normal",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "super",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "ultra",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png",
          selected: false,
          amount: 0,
        },
        {
          name: "master",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png",
          selected: false,
          amount: 0,
        },
      ],
    };
  },

  computed: {
    ...mapState({
      pokemonsOwned: (state) => state.pokemonsOwned,
      coins: (state) => state.coins,
      pokeballs: (state) => state.pokeballs,
    }),
  },

  methods: {
    ...mapActions(["decrementCoins", "incrementCoins"]),
    submitPassword() {
      const encodedPassword = btoa(this.password);
      if (encodedPassword === "ZGlnaWNhcmQ=") {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    },

    addCoins() {
      this.incrementCoins(this.amountCoins);
      this.amountCoins = 0;
    },

    resetCoins() {
      let coins = Number(localStorage.getItem("coins"));
      this.decrementCoins(coins);
    },

    handleInput() {
      if (this.amountCoins !== null) {
        let inputNumber = parseInt(this.amountCoins);
        if (inputNumber === 0) {
          this.amountCoins = null;
        } else {
          this.amountCoins = inputNumber;
        }
      }

      if (this.amountPokeballs !== null) {
        let inputNumber = parseInt(this.amountPokeballs);
        if (inputNumber === 0) {
          this.amountPokeballs = null;
        } else {
          this.amountPokeballs = inputNumber;
        }
      }
    },

    addPokeball(type, quantity) {
      const newPokeballs = { [type]: quantity };
      store.commit("buyPokeballs", newPokeballs);
      this.updateBalls();
    },

    resetPokeballs(){
        store.commit("resetPokeballs");
        this.updateBalls();
    },

    updateBalls() {
      const pokeLS = JSON.parse(localStorage.getItem("pokeballs"));
      this.balls = [
        {
          name: "normal",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/pokeball_sell.png",
          selected: false,
          amount: pokeLS.normal !== undefined ? pokeLS.normal : 0,
        },
        {
          name: "super",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/superball_sell.png",
          selected: false,
          amount: pokeLS.super !== undefined ? pokeLS.super : 0,
        },
        {
          name: "ultra",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/ultraball_sell.png",
          selected: false,
          amount: pokeLS.ultra !== undefined ? pokeLS.ultra : 0,
        },
        {
          name: "master",
          src: "https://raw.githubusercontent.com/vonKaster/pokedex/main/src/assets/img/masterball_sell.png",
          selected: false,
          amount: pokeLS.master !== undefined ? pokeLS.master : 0,
        },
      ];
    },
  },

  mounted() {
    this.updateBalls();
  },
};
</script>

<style>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}


.login-textfield {
  width: 200px;
}

.card-textfield {
  width: 260px;
}

.v-select {
  width: 270px;
}
</style>
