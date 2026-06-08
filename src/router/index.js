import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("@/views/Home")
    },
    {
      name: "home-tag",
      path: "/tag/:tag",
      component: () => import("@/views/Home")
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/Login")
    },
    {
      name: "register",
      path: "/register",
      component: () => import("@/views/Register")
    },
    {
      name: "settings",
      path: "/settings",
      component: () => import("@/views/Settings"),
      meta: { requiresAuth: true }
    },
    {
      name: "profile",
      path: "/profile/:username",
      component: () => import("@/views/Profile")
    },
    {
      name: "profile-favorites",
      path: "/profile/:username/favorites",
      component: () => import("@/views/Profile")
    },
    {
      name: "article",
      path: "/article/:slug",
      component: () => import("@/views/Article"),
      props: true
    },
    {
      name: "editor-new",
      path: "/editor",
      component: () => import("@/views/ArticleEdit"),
      meta: { requiresAuth: true }
    },
    {
      name: "article-edit",
      path: "/editor/:slug",
      props: true,
      component: () => import("@/views/ArticleEdit"),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const needsAuth =
    to.meta && to.meta.requiresAuth
      ? true
      : to.path === "/" && to.query.feed === "following";
  if (needsAuth && !store.getters.isAuthenticated) {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
