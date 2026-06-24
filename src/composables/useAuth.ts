import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const authStore = useAuthStore();
  const { currentUser, isAuthenticated, authStatus, errors } =
    storeToRefs(authStore);
  const router = useRouter();

  function requireAuth(): boolean {
    if (isAuthenticated.value) return true;
    router.push({ name: "login" });
    return false;
  }

  return {
    authStore,
    currentUser,
    isAuthenticated,
    authStatus,
    errors,
    requireAuth
  };
}
