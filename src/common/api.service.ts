import JwtService from "@/common/jwt.service";
import { API_URL } from "@/common/config";

type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ApiRequestError extends Error {
  response: {
    status: number;
    data: Record<string, unknown>;
  };
}

// Thin fetch wrapper. Resolves with `{ data }` and rejects with an error
// carrying `response: { status, data }` for HTTP errors (no `response` for
// network failures), which is the shape extractErrors() consumes.
async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
) {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = JwtService.getToken();
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  const options: RequestInit = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}/${path}`, options);

  // 204s and malformed payloads both yield null data rather than throwing.
  let data: T | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      `[RWV] API ${method} ${path} ${response.status}`
    ) as ApiRequestError;
    error.response = {
      status: response.status,
      data: (data as Record<string, unknown>) || {}
    };
    throw error;
  }
  return { data: data as T };
}

const ApiService = {
  query(resource: string, config?: { params?: QueryParams }) {
    const params = config?.params || {};
    const search = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return request("GET", search ? `${resource}?${search}` : resource);
  },

  get<T = unknown>(resource: string, slug = "") {
    const path = slug ? `${resource}/${slug}` : resource;
    return request<T>("GET", path);
  },

  post<T = unknown>(resource: string, params?: unknown) {
    return request<T>("POST", resource, params);
  },

  update(resource: string, slug: string, params: unknown) {
    return request("PUT", `${resource}/${slug}`, params);
  },

  put<T = unknown>(resource: string, params: unknown) {
    return request<T>("PUT", resource, params);
  },

  delete(resource: string) {
    return request("DELETE", resource);
  }
};

export default ApiService;

export const TagsService = {
  get() {
    return ApiService.get("tags");
  }
};

export const ArticlesService = {
  query(type: string, params: QueryParams) {
    return ApiService.query("articles" + (type === "feed" ? "/feed" : ""), {
      params: params
    });
  },
  get(slug: string) {
    return ApiService.get("articles", slug);
  },
  create(params: unknown) {
    return ApiService.post("articles", { article: params });
  },
  update(slug: string, params: unknown) {
    return ApiService.update("articles", slug, { article: params });
  },
  destroy(slug: string) {
    return ApiService.delete(`articles/${slug}`);
  }
};

export const CommentsService = {
  get(slug: string) {
    if (typeof slug !== "string") {
      throw new Error(
        "[RWV] CommentsService.get() article slug required to fetch comments"
      );
    }
    return ApiService.get("articles", `${slug}/comments`);
  },

  post(slug: string, payload: string) {
    return ApiService.post(`articles/${slug}/comments`, {
      comment: { body: payload }
    });
  },

  destroy(slug: string, commentId: string | number) {
    return ApiService.delete(`articles/${slug}/comments/${commentId}`);
  }
};

export const FavoriteService = {
  add(slug: string) {
    return ApiService.post(`articles/${slug}/favorite`);
  },
  remove(slug: string) {
    return ApiService.delete(`articles/${slug}/favorite`);
  }
};
