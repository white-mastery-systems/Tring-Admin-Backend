import { ref, computed, onMounted } from 'vue';
import countryData from "~/assets/country-codes.json";
import { useFetch } from "#app"; // Ensure correct import for Nuxt

// export function useCountryData() {
//   const locationData = ref(null);
//   const error = ref(null);

//   const fetchLocation = async () => {
//     try {
//       const { data, error: fetchError } = await useFetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');

//       if (fetchError.value) {
//         throw new Error(fetchError.value.message || 'Failed to fetch location data');
//       }

//       locationData.value = data.value;
//     } catch (err) {
//       console.error(err);
//       error.value = err.message;
//       // toast.error(err.message); // Uncomment if using a toast library
//     }
//   };

//   const countryDetails = computed(() => {
//     if (!locationData.value) return "India"; // Default fallback
//     const country = countryData.find(country => country.code === locationData.value.country);
//     return country ? country.name : 'In';
//   });

//   onMounted(fetchLocation); // No need to wrap in async/await

//   return { locationData, countryDetails, fetchLocation, error };
// }


export function useCountryMatchData(fieldValue: Ref<string>) {
  const locationData = ref();
  const selectedCountry = ref('');

  const fetchLocation = async () => {
    try {
      const { data, error: fetchError } = await useFetch('https://ipv4-check-perf.radar.cloudflare.com/api/info');
      if (fetchError.value) {
        toast.error('Failed to fetch location data');
      }
      locationData.value = data.value;
      updateCountry();
    } catch (err) {
      toast.error('Failed to fetch location data');
    }
  };

  const updateCountry = () => {
    if (fieldValue.value) {
      selectedCountry.value = fieldValue.value;
    } else {
      selectedCountry.value = countryData.find(country => country.code === locationData.value?.country)?.name.trim() || 'India';
    }
  };

  watch(fieldValue, updateCountry);

  onMounted(fetchLocation);

  return { country: selectedCountry };
}

