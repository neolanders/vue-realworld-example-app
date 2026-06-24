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

<script setup>
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { usePagination } from "@/composables/usePagination";
import { useProfileStore } from "@/store/profile";
import RwvArticleList from "@/components/ArticleList";

const DEFAULT_AVATAR = "/default-avatar.svg";

defineOptions({ name: "RwvProfile" });

const route = useRoute();
const profileStore = useProfileStore();
const { currentUser, requireAuth } = useAuth();
const { currentPage, onPageChange } = usePagination();
const { profile, errors: profileErrors } = storeToRefs(profileStore);

onMounted(() => profileStore.fetchProfile(route.params));
// The component is reused between the articles/favorites tabs and other
// profiles, so refetch on any route change.
watch(route, (to) => profileStore.fetchProfile(to.params));

const hasProfileErrors = computed(
  () => Object.keys(profileErrors.value || {}).length > 0
);

const profileLoaded = computed(
  () => !!(profile.value && profile.value.username)
);

const username = computed(() => route.params.username);

const showFavorited = computed(() => route.name === "profile-favorites");

const avatarUrl = computed(() =>
  profile.value && profile.value.image ? profile.value.image : DEFAULT_AVATAR
);

const isCurrentUser = () => {
  if (currentUser.value.username && profile.value.username) {
    return currentUser.value.username === profile.value.username;
  }
  return false;
};

const follow = () => {
  if (!requireAuth()) return;
  profileStore.follow(route.params);
};

const unfollow = () => {
  profileStore.unfollow(route.params);
};
</script>
