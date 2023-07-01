import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "customer" */ "./views/Customer.vue"),
  },
  {
    path: "/admin",
    component: () =>
      import(/* webpackChunkName: "customer" */ "./views/Admin.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
