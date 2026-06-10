<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <RwvListErrors :errors="errors" />
          <form @submit.prevent="onPublish(article.slug)">
            <fieldset :disabled="inProgress">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  name="title"
                  v-model="article.title"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="description"
                  v-model="article.description"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  name="body"
                  v-model="article.body"
                  placeholder="Write your article (in markdown)"
                >
                </textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tagInput"
                  @keypress.enter.prevent="addTag(tagInput)"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) of article.tagList"
                    :key="tag + index"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"> </i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
            >
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import pinia from "@/store";
import { useArticleStore } from "@/store/article";
import RwvListErrors from "@/components/ListErrors";
import { extractErrors } from "@/common/errors";

export default {
  name: "RwvArticleEdit",
  components: { RwvListErrors },
  beforeRouteUpdate() {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use the hook to reset the state.
    useArticleStore(pinia).$reset();
  },
  async beforeRouteEnter(to) {
    // If we arrive directly at this url, we need to fetch the article
    const articleStore = useArticleStore(pinia);
    articleStore.$reset();
    if (to.params.slug !== undefined) {
      await articleStore.fetchArticle(to.params.slug);
    }
  },
  beforeRouteLeave() {
    useArticleStore(pinia).$reset();
  },
  data() {
    return {
      tagInput: null,
      inProgress: false,
      errors: {}
    };
  },
  computed: {
    ...mapState(useArticleStore, ["article"])
  },
  methods: {
    ...mapActions(useArticleStore, {
      publishArticle: "publishArticle",
      editArticle: "editArticle",
      addTagToArticle: "addTag",
      removeTagFromArticle: "removeTag"
    }),
    onPublish(slug) {
      this.inProgress = true;
      const result = slug ? this.editArticle() : this.publishArticle();
      result
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push({
            name: "article",
            params: { slug: data.article.slug }
          });
        })
        .catch((error) => {
          this.inProgress = false;
          this.errors = extractErrors(error);
        });
    },
    removeTag(tag) {
      this.removeTagFromArticle(tag);
    },
    addTag(tag) {
      this.addTagToArticle(tag);
      this.tagInput = null;
    }
  }
};
</script>
