import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  data: {
  },
  state: {
    coins: Number(localStorage.getItem("coins")) || 0,
    pokemonsOwned: JSON.parse(localStorage.getItem("pokemonsOwned")) || []
  },
  getters: {
  },
  mutations: {
    incrementCoins(state) {
      state.coins += 100;
      localStorage.setItem("coins", state.coins);
    },
    decrementCoins(state) {
      state.coins -= 100;
      localStorage.setItem("coins", state.coins);
    },
    updatePokemonsOwned(state, pokemons) {
      state.pokemonsOwned = pokemons;
      localStorage.setItem('pokemonsOwned', JSON.stringify(pokemons));
    },
    updateCoins(state, coins) {
      state.coins = coins;
      localStorage.setItem("coins", JSON.stringify(coins));
    }
  },
  actions: {
  },
  modules: {
  },
  watch: {
      coins(newValue) {
        localStorage.setItem("coins", JSON.stringify(newValue));
      },
      pokemonsOwned(newValue) {
        localStorage.setItem("pokemonsOwned", JSON.stringify(newValue));
      },
  },
  actions: {
    addPokemon({ commit }, pokemon) {
      const pokemons = [...this.state.pokemonsOwned, pokemon];
      commit('updatePokemonsOwned', pokemons);
    },
    removePokemon({ commit }, id) {
      const pokemons = this.state.pokemonsOwned.filter(p => p.id !== id);
      commit('updatePokemonsOwned', pokemons);
    }
  },
})
