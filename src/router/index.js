import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requireAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const requireAuth = to.matched.some(record => record.meta.requireAuth);

  let userLoggedIn = currentUser !== null;

  if (requireAuth && !userLoggedIn) next("/login");
  else next();
});

export default router;
