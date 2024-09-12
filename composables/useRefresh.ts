export const useCount = () => {
  const { status, data: integrationsData, refresh } = useLazyAsyncData('integrations-data', () => 
    $fetch('/api/org/integrations/number-integration')
  );

  return {
    status,            
    integrationsData, 
    refresh,   
  };
};
