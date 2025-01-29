import { ref } from 'vue';

export async function useUserDetails() {
  // (await useUser()).refreshUser();
  const storedUser = localStorage.getItem('user');
  const userDetails = ref(storedUser ? JSON.parse(storedUser) : null);
  const userLocationDetails = ref(await getLocationDetail());

  return { userDetails, userLocationDetails };
}

async function getLocationDetail() {
  const response = await fetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
  return response.json();
}
  