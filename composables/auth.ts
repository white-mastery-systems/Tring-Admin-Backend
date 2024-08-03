import type { User } from "lucia";

export const useUser = async () => {
  const user = useState<User | null>("user");
  if (!user.value) {
    const data = await $fetch<User>("/api/user");
    if (data) {
      user.value = data;
    }
  }

  const isAdmin = computed(() => {
    if (!user.value) return false;
    return user.value.role === "admin";
  });

  const clearUser = () => {
    user.value = null;
  };
  return { user, isAdmin, clearUser };
};
