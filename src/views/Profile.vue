<template>
  <div class="profile-page">
    <div v-if="hasProfileErrors" class="container page">
      <p>This profile could not be loaded. Please try again later.</p>
    </div>
    <div v-else-if="!profileLoaded" class="container page">
      <p>Loading profile...</p>
    </div>
    <template v-else>
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img :src="avatarUrl" class="user-img" />
              <h4>{{ profile.username }}</h4>
              <p>{{ profile.bio }}</p>
              <div v-if="isCurrentUser()">
                <router-link
                  class="btn btn-sm btn-outline-secondary action-btn"
                  :to="{ name: 'settings' }"
                >
                  <i class="ion-gear-a"></i> Edit Profile Settings
                </router-link>
              </div>
              <div v-else>
                <button
                  class="btn btn-sm btn-secondary action-btn"
                  v-if="profile.following"
                  @click.prevent="unfollow()"
                >
                  Unfollow {{ profile.username }}
                </button>
                <button
                  class="btn btn-sm btn-outline-secondary action-btn"
                  v-if="!profile.following"
                  @click.prevent="follow()"
                >
                  Follow {{ profile.username }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    exact-active-class="active"
                    :to="{ name: 'profile', params: { username } }"
                  >
                    My Articles
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link
                    class="nav-link"
                    exact-active-class="active"
                    :to="{ name: 'profile-favorites', params: { username } }"
                  >
                    Favorited Articles
                  </router-link>
                </li>
              </ul>
            </div>
            <RwvArticleList
              v-if="!showFavorited"
              :author="username"
              :current-page="currentPage"
              :items-per-page="5"
              @update:currentPage="onPageChange"
            />
            <RwvArticleList
              v-else
              :favorited="username"
              :current-page="currentPage"
              :items-per-page="5"
              @update:currentPage="onPageChange"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import RwvArticleList from "@/components/ArticleList";

const DEFAULT_AVATAR = "/default-avatar.svg";

export default {
  name: "RwvProfile",
  components: { RwvArticleList },
  mounted() {
    this.fetchProfile(this.$route.params);
  },
  computed: {
    ...mapState(useAuthStore, ["currentUser", "isAuthenticated"]),
    ...mapState(useProfileStore, {
      profile: "profile",
      profileErrors: "errors"
    }),
    hasProfileErrors() {
      return Object.keys(this.profileErrors || {}).length > 0;
    },
    profileLoaded() {
      return !!(this.profile && this.profile.username);
    },
    username() {
      return this.$route.params.username;
    },
    showFavorited() {
      return this.$route.name === "profile-favorites";
    },
    currentPage() {
      const p = parseInt(this.$route.query.page, 10);
      return p > 0 ? p : 1;
    },
    avatarUrl() {
      return this.profile && this.profile.image
        ? this.profile.image
        : DEFAULT_AVATAR;
    }
  },
  methods: {
    ...mapActions(useProfileStore, {
      fetchProfile: "fetchProfile",
      followProfile: "follow",
      unfollowProfile: "unfollow"
    }),
    isCurrentUser() {
      if (this.currentUser.username && this.profile.username) {
        return this.currentUser.username === this.profile.username;
      }
      return false;
    },
    follow() {
      if (!this.isAuthenticated) return;
      this.followProfile(this.$route.params);
    },
    unfollow() {
      this.unfollowProfile(this.$route.params);
    },
    onPageChange(page) {
      const query = { ...this.$route.query };
      if (page > 1) query.page = String(page);
      else delete query.page;
      this.$router.push({ path: this.$route.path, query });
    }
  },
  watch: {
    $route(to) {
      this.fetchProfile(to.params);
    }
  }
};
</script>
