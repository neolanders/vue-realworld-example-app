import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("@/views/Home.vue")
    },
    {
      name: "home-tag",
      path: "/tag/:tag",
      component: () => import("@/views/Home.vue")
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/Login.vue")
    },
    {
      name: "register",
      path: "/register",
      component: () => import("@/views/Register.vue")
    },
    {
      name: "settings",
      path: "/settings",
      component: () => import("@/views/Settings.vue"),
      meta: { requiresAuth: true }
    },
    {
      name: "profile",
      path: "/profile/:username",
      component: () => import("@/views/Profile.vue")
    },
    {
      name: "profile-favorites",
      path: "/profile/:username/favorites",
      component: () => import("@/views/Profile.vue")
    },
    {
      name: "article",
      path: "/article/:slug",
      component: () => import("@/views/Article.vue"),
      props: true
    },
    {
      name: "editor-new",
      path: "/editor",
      component: () => import("@/views/ArticleEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      name: "article-edit",
      path: "/editor/:slug",
      props: true,
      component: () => import("@/views/ArticleEdit.vue"),
      meta: { requiresAuth: true }
    }
  ]
});

// Auth-gated redirects live in main.js, after the auth check has resolved.

export default router;
