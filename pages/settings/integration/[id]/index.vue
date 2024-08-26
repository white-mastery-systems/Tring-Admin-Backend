<template>
  <div class="grid h-full items-center justify-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
</template>
<script setup lang="ts">
  const route = useRoute();
  onMounted(async () => {
    console.log({ route: route.query, asdf: route.params });
    console.log(route?.query?.code, "route.query.code");
    console.log(route?.query?.location, "location");
    console.log(route?.query["accounts-server"], "accounts");
    if (
      route?.query?.code &&
      route?.query?.location &&
      route?.query["accounts-server"]
    )
      verifyIntegration({
        integrationDetails: {
          metaData: {
            code: route?.query?.code,
            location: route?.query?.location,
            accountsServer: route?.query["accounts-server"],
          },
          crm: route?.params?.id,
        },
        onSuccess: async () => {
          await navigateTo("/settings/integration");
        },
      });
    else {
      toast.error("Verification failed");
      await navigateTo("/settings/integration");
    }
  });
</script>
