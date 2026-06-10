import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import { extractErrors } from "@/common/errors";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  UPDATE_USER
} from "./actions.type";
import {
  SET_AUTH,
  SET_AUTH_UNAVAILABLE,
  PURGE_AUTH,
  SET_ERROR
} from "./mutations.type";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  // 'authenticated' | 'unauthenticated' | 'unavailable'
  authStatus: JwtService.getToken() ? "authenticated" : "unauthenticated"
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  authStatus(state) {
    return state.authStatus;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("users/login", { user: credentials })
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch((error) => {
          context.commit(SET_ERROR, extractErrors(error));
          reject(error);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("users", { user: credentials })
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch((error) => {
          context.commit(SET_ERROR, extractErrors(error));
          reject(error);
        });
    });
  },
  [CHECK_AUTH](context) {
    if (JwtService.getToken()) {
      return ApiService.get("user")
        .then(({ data }) => {
          if (data && data.user) {
            context.commit(SET_AUTH, data.user);
          } else {
            // 2XX without a parsable user payload (empty body, malformed
            // JSON): treat the server as unavailable but keep the token.
            context.commit(SET_AUTH_UNAVAILABLE);
          }
        })
        .catch((error) => {
          const status = error && error.response && error.response.status;
          if (status >= 400 && status < 500) {
            // The token was rejected: clear it and show the logged-out UI.
            context.commit(PURGE_AUTH);
          } else {
            // 5XX or network failure: the token may still be valid, so keep
            // it and let the user browse in degraded mode.
            context.commit(SET_AUTH_UNAVAILABLE);
          }
        });
    } else {
      context.commit(PURGE_AUTH);
      return Promise.resolve();
    }
  },
  [UPDATE_USER](context, payload) {
    const { email, username, password, image, bio } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", { user }).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.authStatus = "authenticated";
    state.user = user;
    state.errors = {};
    JwtService.saveToken(state.user.token);
  },
  [SET_AUTH_UNAVAILABLE](state) {
    state.isAuthenticated = false;
    state.authStatus = "unavailable";
    state.user = {};
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.authStatus = "unauthenticated";
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
