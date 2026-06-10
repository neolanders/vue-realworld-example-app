<template>
  <div>
    <div v-if="isLoading" class="article-preview">Loading articles...</div>
    <div v-else>
      <div v-if="articles.length === 0" class="article-preview">
        No articles are here... yet.
      </div>
      <RwvArticlePreview
        v-for="(article, index) in articles"
        :article="article"
        :key="article.slug + '-' + index"
      />
      <VPagination
        :pages="pages"
        :current-page="page"
        @update:currentPage="emitPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvArticlePreview from "./VArticlePreview";
import VPagination from "./VPagination";
import { FETCH_ARTICLES } from "../store/actions.type";

export default {
  name: "RwvArticleList",
  components: {
    RwvArticlePreview,
    VPagination
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "all"
    },
    author: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    },
    favorited: {
      type: String,
      required: false
    },
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    },
    currentPage: {
      type: Number,
      required: false,
      default: 1
    }
  },
  computed: {
    page() {
      return this.currentPage > 0 ? this.currentPage : 1;
    },
    listConfig() {
      const { type } = this;
      const filters = {
        offset: (this.page - 1) * this.itemsPerPage,
        limit: this.itemsPerPage
      };
      if (this.author) filters.author = this.author;
      if (this.tag) filters.tag = this.tag;
      if (this.favorited) filters.favorited = this.favorited;
      return { type, filters };
    },
    pages() {
      if (this.isLoading || this.articlesCount <= this.itemsPerPage) {
        return [];
      }
      return [
        ...Array(Math.ceil(this.articlesCount / this.itemsPerPage)).keys()
      ].map((e) => e + 1);
    },
    ...mapGetters(["articlesCount", "isLoading", "articles"])
  },
  watch: {
    page() {
      this.fetchArticles();
    },
    type() {
      this.fetchArticles();
    },
    author() {
      this.fetchArticles();
    },
    tag() {
      this.fetchArticles();
    },
    favorited() {
      this.fetchArticles();
    }
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    fetchArticles() {
      this.$store.dispatch(FETCH_ARTICLES, this.listConfig);
    },
    emitPage(p) {
      this.$emit("update:currentPage", p);
    }
  }
};
</script>
