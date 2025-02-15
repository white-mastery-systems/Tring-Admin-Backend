// composables/useAuth.js
export const useAuth = () => {
  const session = ref();
  const loading = ref(false);
  const error = ref();

  const getSession = async () => {
    loading.value = true;
    try {
      session.value = await $fetch('/api/auth/session');
    } catch (err) {
      console.log(err)
      // error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    session,
    loading,
    error,
    getSession
  };
};
