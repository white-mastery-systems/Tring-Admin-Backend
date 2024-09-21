import type { User } from "lucia";

export const useUser = async () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

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
      const storedUser: any = localStorage.getItem('user');
      user.value = JSON.parse(storedUser)
      localStorage.setItem("user", JSON.stringify(data))
    } else {
      localStorage.clear()
      user.value = null
      navigateTo("/auth/sign-in")
    }
  };

  const updateUser = () => {
     const storedUser = localStorage.getItem('user');
     user.value = storedUser ? JSON.parse(storedUser) : null;
   };
   
  if (!user.value) {
    await refreshUser();
  }
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'user') {
      updateUser();
      refreshUser()
    }
  };

  onMounted(() => {
    // Set up the event listener when the component is mounted
    window.addEventListener('storage', handleStorageChange);
    refreshUser()
  });

  onUnmounted(() => {
    // Clean up the event listener when the component is unmounted
    window.removeEventListener('storage', handleStorageChange);
  });

  return { user, isAdmin, clearUser, refreshUser };
};

//TODO logger https://github.com/unjs/nitro/discussions/334
