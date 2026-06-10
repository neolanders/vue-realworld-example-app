<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'register' }">
              Need an account?
            </router-link>
          </p>
          <ul v-if="errors" class="error-messages">
            <li v-for="(v, k) in errors" :key="k">
              {{ k }} {{ formatError(v) }}
            </li>
          </ul>
          <form @submit.prevent="onSubmit(email, password)">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                name="email"
                v-model="email"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                name="password"
                v-model="password"
                placeholder="Password"
              />
            </fieldset>
            <button type="submit" class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import { formatError } from "@/common/format";

export default {
  name: "RwvLogin",
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    ...mapActions(useAuthStore, ["login"]),
    formatError,
    onSubmit(email, password) {
      this.login({ email, password })
        .then(() => this.$router.push(this.postAuthRoute))
        .catch(() => {});
    }
  },
  computed: {
    ...mapState(useAuthStore, ["errors"]),
    postAuthRoute() {
      const redirect = this.$route.query.redirect;
      // Only allow same-app paths to avoid open redirects.
      if (typeof redirect === "string" && redirect.startsWith("/")) {
        return redirect;
      }
      return { name: "home" };
    }
  }
};
</script>
