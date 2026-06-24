import { defineStore } from "pinia";
import ApiService, { type ApiRequestError } from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import { extractErrors } from "@/common/errors";

import type { User, AuthStatus, ApiErrors, UserResponse } from "@/types/realworld";

interface AuthState {
  errors: ApiErrors;
  user: Partial<User>;
  isAuthenticated: boolean;
  authStatus: AuthStatus;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  username: string;
}

interface UpdateUserPayload {
  email: string;
  username: string;
  password?: string;
  image: string | null;
  bio: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    errors: null,
    user: {},
    isAuthenticated: !!JwtService.getToken(),
    authStatus: JwtService.getToken() ? "authenticated" : "unauthenticated"
  }),
  getters: {
    currentUser: (state) => state.user
  },
  actions: {
    setAuth(user: User) {
      this.isAuthenticated = true;
      this.authStatus = "authenticated";
      this.user = user;
      this.errors = {};
      JwtService.saveToken(user.token);
    },
    setAuthUnavailable() {
      this.isAuthenticated = false;
      this.authStatus = "unavailable";
      this.user = {};
    },
    purgeAuth() {
      this.isAuthenticated = false;
      this.authStatus = "unauthenticated";
      this.user = {};
      this.errors = {};
      JwtService.destroyToken();
    },
    async login(credentials: LoginCredentials) {
      try {
        const { data } = await ApiService.post<UserResponse>("users/login", {
          user: credentials
        });
        this.setAuth(data.user);
        return data;
      } catch (error) {
        this.errors = extractErrors(error);
        throw error;
      }
    },
    logout() {
      this.purgeAuth();
    },
    async register(credentials: RegisterCredentials) {
      try {
        const { data } = await ApiService.post<UserResponse>("users", {
          user: credentials
        });
        this.setAuth(data.user);
        return data;
      } catch (error) {
        this.errors = extractErrors(error);
        throw error;
      }
    },
    async checkAuth() {
      if (!JwtService.getToken()) {
        this.purgeAuth();
        return;
      }
      try {
        const { data } = await ApiService.get<UserResponse>("user");
        if (data?.user) {
          this.setAuth(data.user);
        } else {
          // 2XX without a parsable user payload (empty body, malformed
          // JSON): treat the server as unavailable but keep the token.
          this.setAuthUnavailable();
        }
      } catch (error: unknown) {
        const status = (error as ApiRequestError).response?.status;
        if (status && status >= 400 && status < 500) {
          // The token was rejected: clear it and show the logged-out UI.
          this.purgeAuth();
        } else {
          // 5XX or network failure: the token may still be valid, so keep
          // it and let the user browse in degraded mode.
          this.setAuthUnavailable();
        }
      }
    },
    async updateUser(payload: UpdateUserPayload) {
      const { email, username, password, image, bio } = payload;
      const user: UpdateUserPayload = {
        email,
        username,
        bio,
        image
      };
      if (password) {
        user.password = password;
      }

      const { data } = await ApiService.put<UserResponse>("user", { user });
      this.setAuth(data.user);
      return data;
    }
  }
});
