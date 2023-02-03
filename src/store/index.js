import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  data: {},
  state: {
    coins: Number(localStorage.getItem("coins")) || 0,
    pokemonsOwned: JSON.parse(localStorage.getItem("pokemonsOwned")) || [],
    lastPokemonRolled: JSON.parse(localStorage.getItem("lastPokemon")) || {},
    timer: JSON.parse(localStorage.getItem("timer")) || 30,
  },
  getters: {},
  mutations: {
    setTimer(state, timer) {
      state.timer = timer
      localStorage.setItem("timer", timer)
    },
    incrementCoins(state) {
      state.coins += 20;
      localStorage.setItem("coins", state.coins);
    },
    decrementCoins(state) {
      state.coins -= 20;
      localStorage.setItem("coins", state.coins);
    },
    updatePokemonsOwned(state, pokemons) {
      state.pokemonsOwned = pokemons;
      localStorage.setItem("pokemonsOwned", JSON.stringify(pokemons));
    },
    updateCoins(state, coins) {
      state.coins = coins;
      localStorage.setItem("coins", JSON.stringify(coins));
    },
    updateLastPokemonRolled(state, lastPokemonRolled) {
      state.lastPokemonRolled = lastPokemonRolled;
      localStorage.clear("lastPokemon");
      localStorage.setItem("lastPokemon", JSON.stringify(lastPokemonRolled));
    },
  },
  modules: {},
  watch: {
    coins(newValue) {
      localStorage.setItem("coins", JSON.stringify(newValue));
    },
    pokemonsOwned(newValue) {
      localStorage.setItem("pokemonsOwned", JSON.stringify(newValue));
    },
    timer(newValue) {
      localStorage.setItem("timer", newValue);
    },
  },
  actions: {
    addPokemon({ commit }, pokemon) {
      const pokemons = [...this.state.pokemonsOwned, pokemon];
      commit("updatePokemonsOwned", pokemons);
    },
    removePokemon({ commit }, id) {
      const pokemons = this.state.pokemonsOwned.filter((p) => p.id !== id);
      commit("updatePokemonsOwned", pokemons);
    },
    setTimer({ commit }, timer) {
      commit("setTimer", timer)
    },
  },
  getters: {
    getTimer(state) {
      return state.timer
    }
  }
});
