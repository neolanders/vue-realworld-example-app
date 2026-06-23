export interface User {
    email: string;
    username: string;
    bio: string | null;
    image: string | null;
    token?: string;
  }
  export interface Article {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Pick<User, "username" | "bio" | "image">;
  }
  export type AuthStatus = "authenticated" | "unauthenticated" | "unavailable";
  export type ApiErrors = Record<string, string | string[]> | null;