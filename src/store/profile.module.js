import ApiService from "@/common/api.service";
import { extractErrors } from "@/common/errors";
import {
  FETCH_PROFILE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "./actions.type";
import { SET_PROFILE, SET_PROFILE_ERROR } from "./mutations.type";

const state = {
  errors: {},
  profile: {}
};

const PROFILE_FETCH_RETRIES = 2;
const PROFILE_FETCH_RETRY_DELAY = 400;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getters = {
  profile(state) {
    return state.profile;
  },
  profileErrors(state) {
    return state.errors;
  }
};

const actions = {
  async [FETCH_PROFILE](context, payload) {
    const { username } = payload;
    // Profiles can be briefly missing right after registration on an
    // eventually-consistent backend, so retry before declaring an error.
    for (let attempt = 0; ; attempt++) {
      try {
        const { data } = await ApiService.get("profiles", username);
        context.commit(SET_PROFILE, data.profile);
        return data;
      } catch (error) {
        if (attempt >= PROFILE_FETCH_RETRIES) {
          context.commit(SET_PROFILE_ERROR, extractErrors(error));
          return;
        }
        await delay(PROFILE_FETCH_RETRY_DELAY);
      }
    }
  },
  [FETCH_PROFILE_FOLLOW](context, payload) {
    const { username } = payload;
    return ApiService.post(`profiles/${username}/follow`)
      .then(({ data }) => {
        context.commit(SET_PROFILE, data.profile);
        return data;
      })
      .catch(() => {
        // Leave the profile as-is; the follow button simply stays unchanged.
      });
  },
  [FETCH_PROFILE_UNFOLLOW](context, payload) {
    const { username } = payload;
    return ApiService.delete(`profiles/${username}/follow`)
      .then(({ data }) => {
        context.commit(SET_PROFILE, data.profile);
        return data;
      })
      .catch(() => {
        // Leave the profile as-is; the unfollow button simply stays unchanged.
      });
  }
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = profile;
    state.errors = {};
  },
  [SET_PROFILE_ERROR](state, errors) {
    state.profile = {};
    state.errors = errors;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
