import { inject, provide, type InjectionKey, type Ref } from "vue";

export const articleSlugKey: InjectionKey<Ref<string>> = Symbol("articleSlug");

export function provideArticleSlug(slug: Ref<string>) {
  provide(articleSlugKey, slug);
}

export function useArticleSlug() {
  const slug = inject(articleSlugKey);
  if (!slug) {
    throw new Error("useArticleSlug() requires Article page context");
  }
  return slug;
}
