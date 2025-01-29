import { ref, onMounted } from "vue";
import { useFetch } from "#app"; // Ensure this import is correct for Nuxt

export function useUserDetails() {
  const user = ref<User | null>(null);

  async function fetchAndStoreUser() {
    try {
      // Fetch user details
      const { data: userDetails, refresh } = await useFetch<User>("/api/user");

      // Update `user` with localStorage or fetched data
      const storedUser = localStorage.getItem("user");
      console.log(storedUser, "storedUser");
      user.value = storedUser ? JSON.parse(storedUser) : null;

      if (userDetails.value) {
        user.value = userDetails.value;
        localStorage.setItem("user", JSON.stringify(userDetails.value));
      }

      return { refresh };
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // Clear localStorage and reset user on error
      user.value = null;
      localStorage.removeItem("user");
    }
  }

  // Automatically fetch user details when the component is mounted
  onMounted(() => {
    fetchAndStoreUser();
  });

  return {
    user,
    fetchAndStoreUser,
  };
}