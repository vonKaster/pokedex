import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  data: {},
  state: {
    coins: Number(localStorage.getItem("coins")),
    pokemonsOwned: JSON.parse(localStorage.getItem("pokemonsOwned")) || [],
    lastPokemonRolled: JSON.parse(localStorage.getItem("lastPokemon")) || {},
    timer: JSON.parse(localStorage.getItem("timer")) || 10,
    pokeballs: JSON.parse(localStorage.getItem("pokeballs")) || {},
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
    updatePokeballs(state, pokeballs) {
      state.pokeballs = pokeballs;
      localStorage.setItem("pokeballs", JSON.stringify(pokeballs));
    },
    buyPokeballs(state, newPokeballs) {
      const pokeballs = state.pokeballs;
      Object.keys(newPokeballs).forEach((key) => {
        if (pokeballs[key]) {
          pokeballs[key] += newPokeballs[key];
        } else {
          pokeballs[key] = newPokeballs[key];
        }
      });
      state.pokeballs = pokeballs;
      localStorage.setItem("pokeballs", JSON.stringify(pokeballs));
    },
    resetPokeballs(state) {
      let pokeballs = state.pokeballs;
      pokeballs = { normal: 0, super: 0, ultra: 0, master: 0 };
      state.pokeballs = pokeballs;
      localStorage.setItem("pokeballs", JSON.stringify(pokeballs));
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
    pokeballs(newValue) {
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
    setPokeballs({ commit }, pokeballs) {
      commit("updatePokeballs", pokeballs);
    },
  },
  getters: {
    getTimer(state) {
      return state.timer;
    },
  },
});
