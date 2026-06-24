<template>
  <div class="home-page">
    <div v-if="!isAuthenticated" class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="isAuthenticated" class="nav-item">
                <a
                  href="/?feed=following"
                  :class="['nav-link', { active: feedMode === 'following' }]"
                  @click.prevent="goTo({ feed: 'following' })"
                >
                  Your Feed
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="/"
                  :class="['nav-link', { active: feedMode === 'global' }]"
                  @click.prevent="goTo({})"
                >
                  Global Feed
                </a>
              </li>
              <li class="nav-item" v-if="tag">
                <a
                  :href="`/tag/${tag}`"
                  :class="['nav-link', { active: feedMode === 'tag' }]"
                >
                  <i class="ion-pound"></i> {{ tag }}
                </a>
              </li>
            </ul>
          </div>
          <div
            v-if="
              feedMode === 'following' && !isLoading && articles.length === 0
            "
            class="article-preview empty-feed-message"
          >
            Your feed is empty. <a href="/">Go to the Global Feed</a> to
            discover articles.
          </div>
          <RwvArticleList
            :type="articleType"
            :tag="tag"
            :current-page="currentPage"
            :items-per-page="10"
            @update:currentPage="onPageChange"
          />
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <RwvTag v-for="(t, index) in tags" :name="t" :key="index" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { usePagination } from "@/composables/usePagination";
import { useHomeStore } from "@/store/home";
import RwvTag from "@/components/VTag.vue";
import RwvArticleList from "@/components/ArticleList.vue";
defineOptions({ name: "RwvHome" });
type FeedMode = "following" | "global" | "tag";
const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();
const { isAuthenticated } = useAuth();
const { currentPage, onPageChange } = usePagination();
const { tags, isLoading, articles } = storeToRefs(homeStore);
onMounted(() => {
  homeStore.fetchTags().catch(() => {});
});
const tag = computed(() => {
  const value = route.params.tag;
  return typeof value === "string" ? value : undefined;
});
const feedMode = computed((): FeedMode => {
  if (tag.value) return "tag";
  if (route.query.feed === "following") return "following";
  return "global";
});
const articleType = computed(() =>
  feedMode.value === "following" ? "feed" : "all"
);
const goTo = (query: Record<string, string>) => {
  router.push({ path: "/", query });
};
</script>
