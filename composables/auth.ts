import type { User } from "lucia";

export const useUser = async () => {
  const user = useState<User | null>("user");

  const isAdmin = computed(() => {
    if (!user.value) return false;
    return user.value.role === "admin";
  });

  const clearUser = () => {
    user.value = null;
  };

  const refreshUser = async () => {
    const data = await $fetch<User>("/api/user");
    if (data) {
      user.value = data;
    }
  };

  if (!user.value) {
    await refreshUser();
  }

  return { user, isAdmin, clearUser, refreshUser };
};
