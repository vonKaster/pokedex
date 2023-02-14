<template>
  <div class="container text-center d-flex">
    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" src="../assets/img/pokeball_sell.png">
      </v-img>

      <div>
        <v-card-title>Pokeball Normal</v-card-title>
        <v-card-text class="pb-0 text-left ms-4">Precio: 20 </v-card-text>
        <v-card-text class="pb-0 text-left ms-4"
          >Probabilidad del 30% de atrapar
        </v-card-text>

        <div class="mt-2">
          <v-btn
            color="primary"
            class="ms-2"
            @click="quantityNormal--"
            :disabled="quantityNormal <= 0"
          >
            -
          </v-btn>
          <v-btn color="primary" class="ms-2">{{ quantityNormal }}</v-btn>
          <v-btn color="primary" class="ms-2" @click="quantityNormal++">
            +
          </v-btn>
        </div>

        <v-card-actions>
          <v-btn
            :disabled="quantityNormal === 0"
            color="green"
            text
            @click="addPokeball('normal', quantityNormal)"
          >
            Comprar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" src="../assets/img/superball_sell.png">
      </v-img>

      <div>
        <v-card-title>Pokeball Super</v-card-title>
        <v-card-text class="pb-0 text-left ms-4">Precio: 30 </v-card-text>
        <v-card-text class="pb-0 text-left ms-4"
          >Probabilidad del 50% de atrapar
        </v-card-text>

        <div class="mt-2">
          <v-btn
            color="primary"
            class="ms-2"
            @click="quantitySuper--"
            :disabled="quantitySuper <= 0"
          >
            -
          </v-btn>
          <v-btn color="primary" class="ms-2">{{ quantitySuper }}</v-btn>
          <v-btn color="primary" class="ms-2" @click="quantitySuper++">
            +
          </v-btn>
        </div>

        <v-card-actions>
          <v-btn
            :disabled="quantitySuper === 0"
            color="green"
            text
            @click="addPokeball('super', quantitySuper)"
          >
            Comprar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="300px">
      <v-img text-center max-width="300" src="../assets/img/ultraball_sell.png">
      </v-img>

      <div>
        <v-card-title>Pokeball Ultra</v-card-title>
        <v-card-text class="pb-0 text-left ms-4">Precio: 50 </v-card-text>
        <v-card-text class="pb-0 text-left ms-4"
          >Probabilidad del 75% de atrapar
        </v-card-text>

        <div class="mt-2">
          <v-btn
            color="primary"
            class="ms-2"
            @click="quantityUltra--"
            :disabled="quantityUltra <= 0"
          >
            -
          </v-btn>
          <v-btn color="primary" class="ms-2">{{ quantityUltra }}</v-btn>
          <v-btn color="primary" class="ms-2" @click="quantityUltra++">
            +
          </v-btn>
        </div>

        <v-card-actions>
          <v-btn
            :disabled="quantityUltra === 0"
            color="green"
            text
            @click="addPokeball('ultra', quantityUltra)"
          >
            Comprar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <v-card class="mx-auto" max-width="300px">
      <v-img
        text-center
        max-width="300"
        src="../assets/img/masterball_sell.png"
      >
      </v-img>

      <div>
        <v-card-title>Pokeball Master</v-card-title>
        <v-card-text class="pb-0 text-left ms-4">Precio: 100 </v-card-text>
        <v-card-text class="pb-0 text-left ms-4"
          >Probabilidad del 100% de atrapar
        </v-card-text>

        <div class="mt-2">
          <v-btn
            color="primary"
            class="ms-2"
            @click="quantityMaster--"
            :disabled="quantityMaster <= 0"
          >
            -
          </v-btn>
          <v-btn color="primary" class="ms-2">{{ quantityMaster }}</v-btn>
          <v-btn color="primary" class="ms-2" @click="quantityMaster++">
            +
          </v-btn>
        </div>

        <v-card-actions>
          <v-btn
            :disabled="quantityMaster === 0"
            color="green"
            text
            @click="addPokeball('master', quantityMaster)"
          >
            Comprar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <v-snackbars bottom right :objects.sync="snackBarAlerts">
      <template v-slot:action="{close}">
    <v-btn text @click="close()">Cerrar</v-btn>
  </template>
    </v-snackbars>
  </div>
</template>

<script>
import store from "@/store/index.js";
import { mapState, mapActions } from "vuex";
import VSnackbars from "v-snackbars";
export default {
  components: { "v-snackbars": VSnackbars },
  data() {
    return {
      pokeball: {
        normal: 0,
        super: 0,
        ultra: 0,
        master: 0,
      },
      quantityNormal: 0,
      quantitySuper: 0,
      quantityUltra: 0,
      quantityMaster: 0,
      snackBarAlerts: []
    };
  },

  computed: {
    ...mapState({
      coins: (state) => state.coins,
      pokeballs: (state) => state.pokeballs,
    }),
  },

  methods: {
    ...mapActions(["decrementCoins", "addPokeball"]),

    addPokeball(type, quantity) {
      const prices = { normal: 20, super: 30, ultra: 50, master: 100 };
      const price = prices[type];

      if (!price) {
        this.callSnackBar(false);
        return;
      }

      if (this.coins >= quantity * price) {
        const newPokeballs = { [type]: quantity };
        store.commit("buyPokeballs", newPokeballs);
        this.decrementCoins(quantity * price);
        this.callSnackBar(true);
      } else {
        this.callSnackBar(false);
      }
      this[`quantity${type[0].toUpperCase() + type.slice(1)}`] = 0;
    },

    callSnackBar(success) {
      if (success === true) {
        this.snackBarAlerts.push({
          message: `Compra realizada con éxito`,
          color: "green",
          timeout: 5000,
        });
      } else {
        this.snackBarAlerts.push({
          message: `¡No tenés suficentes monedas!`,
          color: "red",
          timeout: 5000,
        });
      }
    },
  },
};
</script>
