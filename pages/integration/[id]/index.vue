<template>
  <div class="grid h-full items-center justify-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
</template>
<script setup lang="ts">
  const route = useRoute();
  onMounted(async () => {
    if (
      route?.query?.code &&
      route?.query?.location &&
      route?.query["accounts-server"]
    )
      verifyIntegration({
        integrationDetails: {
          metadata: {
            code: route?.query?.code,
            location: route?.query?.location,
            accountsServer: route?.query["accounts-server"],
          },
          crm: route?.params?.id,
        },
        onSuccess: async () => {
          await navigateTo("/integration");
        },
      });
    else if (route?.query?.code) {
      verifyIntegration({
        integrationDetails: {
          metadata: {
            code: route?.query?.code,
            shop: route?.query?.shop,
          },
          crm: route?.params?.id,
        },
        onSuccess: async () => {
          await navigateTo("/integration");
        },
      });
    } else {
      toast.error("Verification failed");
      await navigateTo("/integration");
    }
  });
</script>
