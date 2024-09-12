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

export const campaignData = () => {
   const { status, data: campaignDataList, refresh } = useLazyAsyncData('campaign-data', () => 
    $fetch('/api/org/campaign')
  );
  return {
    status,
    campaignDataList,
    refresh,
  }
}
