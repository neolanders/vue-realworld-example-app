<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <RwvListErrors v-if="hasErrors" :errors="errors" />
          <form @submit.prevent="updateSettings()">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  name="image"
                  v-model="form.image"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  name="username"
                  v-model="form.username"
                  placeholder="Your username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  name="bio"
                  v-model="form.bio"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  name="email"
                  v-model="form.email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  name="password"
                  v-model="form.password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                type="submit"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button @click="logout" class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvListErrors from "@/components/ListErrors";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";
import { extractErrors } from "@/common/errors";

export default {
  name: "RwvSettings",
  components: { RwvListErrors },
  data() {
    return {
      errors: {},
      form: {
        username: "",
        email: "",
        bio: "",
        image: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    }
  },
  mounted() {
    this.syncFromUser();
  },
  watch: {
    "currentUser.username"() {
      this.syncFromUser();
    }
  },
  methods: {
    syncFromUser() {
      const u = this.currentUser || {};
      this.form.username = u.username || "";
      this.form.email = u.email || "";
      this.form.bio = u.bio || "";
      this.form.image = u.image || "";
    },
    updateSettings() {
      const payload = {
        username: this.form.username,
        email: this.form.email,
        bio: this.form.bio,
        image: this.form.image
      };
      if (this.form.password) payload.password = this.form.password;
      this.$store
        .dispatch(UPDATE_USER, payload)
        .then(() => {
          this.errors = {};
          this.$router.push({
            name: "profile",
            params: { username: this.form.username }
          });
        })
        .catch(error => {
          this.errors = extractErrors(error);
        });
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "home" });
      });
    }
  }
};
</script>
