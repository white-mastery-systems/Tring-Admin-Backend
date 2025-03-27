// composables/useNumberIntegration.js
export const useNumberIntegration = (integrationId: any) => {
  const { status, data: numberIntegrationData, refresh } = useLazyAsyncData(
    `number-integration-${integrationId}`,
    () => $fetch(`/api/org/integrations/number-integration/${integrationId}`)
  );

  return {
    status,
    numberIntegrationData,
    refresh,
  };
};