<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">{{ comment.body }}</p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img :src="authorImage" class="comment-author-img" />
      </a>
      <router-link
        class="comment-author"
        :to="{ name: 'profile', params: { username: comment.author.username } }"
      >
        {{ comment.author.username }}
      </router-link>
      <span class="date-posted">{{ formatDate(comment.createdAt) }}</span>
      <span v-if="isCurrentUser" class="mod-options">
        <i class="ion-trash-a" @click="destroy(slug, comment.id)"></i>
      </span>
    </div>
    <RwvListErrors v-if="hasErrors" :errors="errors" />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useArticleStore } from "@/store/article";
import { formatDate } from "@/common/format";
import RwvListErrors from "./ListErrors.vue";
import { extractErrors } from "@/common/errors";

export default {
  name: "RwvComment",
  components: { RwvListErrors },
  props: {
    slug: { type: String, required: true },
    comment: { type: Object, required: true }
  },
  data() {
    return {
      errors: {}
    };
  },
  computed: {
    isCurrentUser() {
      if (this.currentUser.username && this.comment.author.username) {
        return this.comment.author.username === this.currentUser.username;
      }
      return false;
    },
    authorImage() {
      return this.comment.author && this.comment.author.image
        ? this.comment.author.image
        : "/default-avatar.svg";
    },
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    },
    ...mapState(useAuthStore, ["currentUser"])
  },
  methods: {
    ...mapActions(useArticleStore, ["destroyComment"]),
    formatDate,
    destroy(slug, commentId) {
      this.destroyComment({ slug, commentId })
        .then(() => {
          this.errors = {};
        })
        .catch((error) => {
          this.errors = extractErrors(error);
        });
    }
  }
};
</script>
