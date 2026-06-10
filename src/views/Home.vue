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

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useHomeStore } from "@/store/home";
import RwvTag from "@/components/VTag";
import RwvArticleList from "@/components/ArticleList";

export default {
  name: "RwvHome",
  components: { RwvTag, RwvArticleList },
  mounted() {
    this.fetchTags();
  },
  computed: {
    ...mapState(useAuthStore, ["isAuthenticated"]),
    ...mapState(useHomeStore, ["tags", "isLoading", "articles"]),
    tag() {
      return this.$route.params.tag;
    },
    feedMode() {
      if (this.tag) return "tag";
      if (this.$route.query.feed === "following") return "following";
      return "global";
    },
    articleType() {
      return this.feedMode === "following" ? "feed" : "all";
    },
    currentPage() {
      const p = parseInt(this.$route.query.page, 10);
      return p > 0 ? p : 1;
    }
  },
  methods: {
    ...mapActions(useHomeStore, ["fetchTags"]),
    goTo(query) {
      const target = { path: "/", query };
      this.$router.push(target);
    },
    onPageChange(page) {
      const query = { ...this.$route.query };
      if (page > 1) {
        query.page = String(page);
      } else {
        delete query.page;
      }
      this.$router.push({ path: this.$route.path, query });
    }
  }
};
</script>
