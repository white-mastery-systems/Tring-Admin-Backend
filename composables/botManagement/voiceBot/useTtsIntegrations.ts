// In your useTtsIntegrations.js composable
import { ref, shallowRef } from 'vue';

export function useIntegrations(filters = {}) {
  console.log("useIntegrations called with filters:", filters);
  
  // Use shallowRef for better performance with array data
  const integrationsData = shallowRef([]);
  const status = ref('pending');
  const page = ref(1);
  const totalPageCount = ref(0);
  const totalCount = ref(0);
  
  // Define the fetch function
  const fetchIntegrations = async () => {
    try {
      status.value = 'pending';
      
      // Make the API call
      const response = await $fetch("/api/tts-integration", {
        method: 'GET',
        server: false,
        query: filters || {} // Ensure we pass at least an empty object
      });
      
      // Force reactivity update with explicit assignments
      if (response) {
        // Update page information
        page.value = Number(response.page || 1);
        totalPageCount.value = Number(response.totalPageCount || 0);
        totalCount.value = Number(response.totalCount || 0);
        
        // Update data with explicit assignment to trigger reactivity
        if (Array.isArray(response.data)) {
          // Create a new array reference to ensure reactivity
          integrationsData.value = [...response.data];
        } else if (Array.isArray(response)) {
          integrationsData.value = [...response];
        } else {
          console.warn("Unexpected API response format:", response);
          integrationsData.value = [];
        }
      } else {
        integrationsData.value = [];
      }
      
      status.value = 'success';
    } catch (error) {
      console.error("Error fetching integrations:", error);
      status.value = 'error';
      integrationsData.value = [];
    }
  };
  
  // Call fetch immediately using nextTick to ensure Vue's reactivity system is initialized
  nextTick(() => {
    fetchIntegrations();
  });
  
  // Define refresh function
  const integrationRefresh = () => {
    return fetchIntegrations();
  };
  
  // Return everything wrapped in computed properties to ensure reactivity
  return {
    integrationsData,
    status,
    integrationRefresh,
    page,
    totalPageCount,
    totalCount
  };
}