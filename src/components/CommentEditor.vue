<template>
  <div>
    <RwvListErrors :errors="errors" />
    <form class="card comment-form" @submit.prevent="onSubmit(slug, comment)">
      <div class="card-block">
        <textarea
          class="form-control"
          v-model="comment"
          placeholder="Write a comment..."
          rows="3"
        >
        </textarea>
      </div>
      <div class="card-footer">
        <img :src="userImageSrc" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>
  </div>
</template>

<script>
import RwvListErrors from "./ListErrors.vue";
import { COMMENT_CREATE } from "../store/actions.type.js";
import { extractErrors } from "../common/errors";

export default {
  name: "RwvCommentEditor",
  components: { RwvListErrors },
  props: {
    slug: { type: String, required: true },
    content: { type: String, required: false },
    userImage: { type: String, required: false }
  },
  data() {
    return {
      comment: this.content || null,
      errors: {}
    };
  },
  computed: {
    userImageSrc() {
      return this.userImage || "/default-avatar.svg";
    }
  },
  methods: {
    onSubmit(slug, comment) {
      this.$store
        .dispatch(COMMENT_CREATE, { slug, comment })
        .then(() => {
          this.comment = null;
          this.errors = {};
        })
        .catch((error) => {
          this.errors = extractErrors(error);
        });
    }
  }
};
</script>
