<template>
  <nav v-if="pages.length > 1">
    <ul class="pagination">
      <li
        v-for="page in pages"
        :data-test="`page-link-${page}`"
        :key="page"
        :class="paginationClass(page)"
      >
        <button
          type="button"
          class="page-link"
          @click.prevent="changePage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "VPagination",
  props: {
    pages: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  emits: ["update:currentPage"],
  methods: {
    changePage(goToPage) {
      if (goToPage === this.currentPage) return;
      this.$emit("update:currentPage", goToPage);
    },
    paginationClass(page) {
      return {
        "page-item": true,
        active: this.currentPage === page
      };
    }
  }
};
</script>
