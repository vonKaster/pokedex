import Vue from "vue";
import VueRouter from "vue-router";
import PokedexView from "../views/PokedexView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "inicio",
    component: PokedexView,
  },
  {
    path: "/inicio",
    name: "home",
    component: PokedexView,
  },
  {
    path: "/coleccion",
    name: "coleccion",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/MiColeccion.vue"),
  },
  {
    path: "/pokemon/:uid",
    name: "pokemonPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/pokemonPage.vue"),
  },
  {
    path: "/tienda",
    name: "tienda",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/shop.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/AdminPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
