import { useUserDetails } from '~/composables/useUserDetails';

const { fetchAndStoreUser } = useUserDetails();
import { ref } from 'vue';

export const useUserDetailsComposable = () => {
  const userDetails = ref(null);

  const fetchUser = async () => {
    const storedUser = localStorage.getItem('user');
    userDetails.value = storedUser ? JSON.parse(storedUser) : null;
    if (!userDetails.value) fetchAndStoreUser()
  };

  return { userDetails, fetchUser };
};


