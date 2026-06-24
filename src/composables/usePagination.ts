import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export function usePagination() {
  const route = useRoute();
  const router = useRouter();

  const currentPage = computed(() => {
    const p = Number.parseInt(String(route.query.page ?? ""), 10);
    return p > 0 ? p : 1;
  });

  function onPageChange(page: number) {
    const query = { ...route.query } as Record<string, string | undefined>;
    if (page > 1) {
      query.page = String(page);
    } else {
      delete query.page;
    }
    router.push({ path: route.path, query });
  }

  return { currentPage, onPageChange };
}
