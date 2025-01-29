import type { User } from "lucia";
import { useRoute } from "vue-router";

export const useUser = async () => {
  const route = useRoute();
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const isAdmin = computed(() => {
    if (!user.value) return false;
    return user.value.role === "admin";
  });

  const clearUser = () => {
    user.value = null;
    localStorage.clear();
  };

  const refreshUser = async () => {
    try {
      const data = await getUserDetail();
      if (data) {
        console.log(data, "data");

        // Update user details in localStorage
        const storedUser = localStorage.getItem("user");
        user.value = storedUser ? JSON.parse(storedUser) : null;
        localStorage.setItem("user", JSON.stringify(data));

        // Fetch or update orgDetails
        let formattedOrgDetails = JSON.parse(localStorage.getItem("orgDetails") || "null");
        if (!formattedOrgDetails) {
          console.log("Fetching orgDetails");
          const { orgDetails } = await companyDetails();
          formattedOrgDetails = orgDetails
          localStorage.setItem("orgDetails", JSON.stringify(formattedOrgDetails));
        }


        // Handle navigation based on orgDetails
        console.log("formattedOrgDetails top", formattedOrgDetails)
        if (formattedOrgDetails?.planCode === 'chat_free') {
          console.log("Free plan", formattedOrgDetails);
          if (formattedOrgDetails?.metadata?.gst) {
            navigateTo("/billing/view-all");
          } else {
            if (route?.name !== 'auth-onboarding-account') {
              navigateTo("/");
            }
          }
        } else {
          navigateTo("/");
        }
      } else {
        toast.error("Invalid credentials");
        localStorage.clear();
        navigateTo("/auth/sign-in");
      }
    } catch (error) {
      toast.error("Error logging in");
      console.error("Error refreshing user:", error);
      localStorage.clear();
      navigateTo("/auth/sign-in");
    }
  };
  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    user.value = storedUser ? JSON.parse(storedUser) : null;
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "user") {
      const newUser = JSON.parse(event.newValue || "null");
      if (JSON.stringify(newUser) !== JSON.stringify(user.value)) {
        updateUser();
        refreshUser();
      }
    }
  };

  onMounted(() => {
    // Set up the event listener when the component is mounted
    window.addEventListener("storage", handleStorageChange);
  });

  onUnmounted(() => {
    // Clean up the event listener when the component is unmounted
    window.removeEventListener("storage", handleStorageChange);
  });

  return { user, isAdmin, clearUser, refreshUser };
};

export const companyDetails = async () => {
  const orgData = JSON.parse(localStorage.getItem("orgDetails") || "null");
  if (orgData) {
    return {
      orgDetails: orgData,
    };
  } else {
    const { orgDetails } = await $fetch("/api/org", {
      method: "GET",
    });
    localStorage.setItem("orgDetails", JSON.stringify(orgDetails));
    return { orgDetails: orgDetails };
  }
};
