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
    <RwvArticleActions
      v-if="actions"
      :article="article"
      :canModify="isCurrentUser()"
    ></RwvArticleActions>
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

<script setup>
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useArticleStore } from "@/store/article";
import { formatDate } from "@/common/format";
import RwvArticleActions from "@/components/ArticleActions";

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  actions: {
    type: Boolean,
    required: false,
    default: false
  }
});

const articleStore = useArticleStore();
const { currentUser, requireAuth } = useAuth();

const authorImage = computed(() =>
  props.article.author && props.article.author.image
    ? props.article.author.image
    : "/default-avatar.svg"
);

const authorProfileLink = computed(() => {
  const username = props.article.author && props.article.author.username;
  // An article that failed to load has no author; render the meta without
  // links instead of letting router-link throw on the missing param.
  return username ? { name: "profile", params: { username } } : null;
});

const isCurrentUser = () => {
  if (currentUser.value.username && props.article.author.username) {
    return currentUser.value.username === props.article.author.username;
  }
  return false;
};

const toggleFavorite = () => {
  if (!requireAuth()) return;
  if (props.article.favorited) {
    articleStore.removeFavorite(props.article.slug);
  } else {
    articleStore.addFavorite(props.article.slug);
  }
};
</script>
