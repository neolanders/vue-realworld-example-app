import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import { CHECK_AUTH } from "./store/actions.type";
import ApiService from "./common/api.service";
import JwtService from "./common/jwt.service";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

ApiService.init();

let authResolved = false;
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(() => {
    authResolved = true;
    next();
  })
);

const app = new Vue({
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
    return store.getters.isAuthenticated ? "authenticated" : "unauthenticated";
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
