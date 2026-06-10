import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { CHECK_AUTH } from "./store/actions.type";
import JwtService from "./common/jwt.service";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

let authResolved = false;
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(() => {
    authResolved = true;
    // Auth-gated routes are only decided once the auth check has resolved,
    // so an invalid token redirects away instead of showing a broken page.
    const needsAuth =
      (to.meta && to.meta.requiresAuth) ||
      (to.path === "/" && to.query.feed === "following");
    if (needsAuth && !store.getters.isAuthenticated) {
      next({ path: "/login" });
    } else {
      next();
    }
  })
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

window.__conduit_debug__ = {
  getToken: function() {
    return JwtService.getToken();
  },
  getAuthState: function() {
    if (!authResolved) return "loading";
    return store.getters.authStatus;
  },
  getCurrentUser: function() {
    if (!store.getters.isAuthenticated) return null;
    var u = store.getters.currentUser || {};
    if (!u.username) return null;
    return {
      username: u.username,
      email: u.email,
      bio: u.bio == null ? null : u.bio,
      image: u.image == null ? null : u.image,
      token: JwtService.getToken()
    };
  }
};
