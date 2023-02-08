import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  data: {},
  state: {
    coins: Number(localStorage.getItem("coins")),
    pokemonsOwned: JSON.parse(localStorage.getItem("pokemonsOwned")) || [],
    lastPokemonRolled: JSON.parse(localStorage.getItem("lastPokemon")) || {},
    timer: JSON.parse(localStorage.getItem("timer")) || 30,
  },
  getters: {},
  mutations: {
    setTimer(state, timer) {
      state.timer = timer;
      localStorage.setItem("timer", timer);
    },
    updatePokemonsOwned(state, pokemons) {
      state.pokemonsOwned = pokemons;
      localStorage.setItem("pokemonsOwned", JSON.stringify(pokemons));
    },
    updateCoins(state, coins) {
      state.coins = coins;
      localStorage.setItem("coins", coins);
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
      localStorage.setItem("coins", newValue);
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
    removePokemon({ commit }, uid) {
      const pokemons = this.state.pokemonsOwned.filter((p) => p.uid !== uid);
      commit("updatePokemonsOwned", pokemons);
    },
    editPokemon({ commit }, { uid, name }) {
      const pokemons = [...this.state.pokemonsOwned];
      const index = pokemons.findIndex((p) => p.uid === uid);
      pokemons[index] = { ...pokemons[index], name };
      commit("updatePokemonsOwned", pokemons);
    },
    setTimer({ commit }, timer) {
      commit("setTimer", timer);
    },
    incrementCoins({ commit }, amount) {
      const coins = this.state.coins + amount;
      commit("updateCoins", coins);
    },
    decrementCoins({ commit }, amount) {
      const coins = this.state.coins - amount;
      commit("updateCoins", coins);
    },
  },
  getters: {
    getTimer(state) {
      return state.timer;
    },
  },
});
