<template>
  <div class="article-meta">
    <router-link v-if="authorProfileLink" :to="authorProfileLink">
      <img :src="authorImage" />
    </router-link>
    <img v-else :src="authorImage" />
    <div class="info">
      <router-link
        v-if="authorProfileLink"
        :to="authorProfileLink"
        class="author"
      >
        {{ article.author.username }}
      </router-link>
      <span v-else class="author"></span>
      <span class="date">{{ formatDate(article.createdAt) }}</span>
    </div>
    <rwv-article-actions
      v-if="actions"
      :article="article"
      :canModify="isCurrentUser()"
    ></rwv-article-actions>
    <button
      v-else
      class="btn btn-sm pull-xs-right"
      @click="toggleFavorite"
      :class="{
        'btn-primary': article.favorited,
        'btn-outline-primary': !article.favorited
      }"
    >
      <i class="ion-heart"></i>
      <span class="counter"> {{ article.favoritesCount }} </span>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useArticleStore } from "@/store/article";
import { formatDate } from "@/common/format";
import RwvArticleActions from "@/components/ArticleActions";

export default {
  name: "RwvArticleMeta",
  components: {
    RwvArticleActions
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState(useAuthStore, ["currentUser", "isAuthenticated"]),
    authorImage() {
      return this.article.author && this.article.author.image
        ? this.article.author.image
        : "/default-avatar.svg";
    },
    authorProfileLink() {
      const username = this.article.author && this.article.author.username;
      // An article that failed to load has no author; render the meta without
      // links instead of letting router-link throw on the missing param.
      return username ? { name: "profile", params: { username } } : null;
    }
  },
  methods: {
    ...mapActions(useArticleStore, ["addFavorite", "removeFavorite"]),
    formatDate,
    isCurrentUser() {
      if (this.currentUser.username && this.article.author.username) {
        return this.currentUser.username === this.article.author.username;
      }
      return false;
    },
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      if (this.article.favorited) {
        this.removeFavorite(this.article.slug);
      } else {
        this.addFavorite(this.article.slug);
      }
    }
  }
};
</script>
