<template>
    <div
      class="xl:felx hidden h-[100vh] min-w-[250px] max-w-[250px] flex-col items-center gap-[20px] overflow-auto overflow-x-hidden border-r border-[#8a8a8a1a] md:hidden lg:flex"
    >
      <NavigationDrawer />
    </div>
    <!-- mt-2 -->
    <div
      class="h-[100vh] !w-full w-full overflow-y-scroll md:mt-0 lg:mt-0 lg:w-[86%] xl:mt-0"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

  const route = useRoute();
  const routeName = ref(route.name);
  onMounted(async () => {
    const eventSource = new EventSource("/api/sse");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "leads") {
        toast.success(
          `A new lead created generated -- ${data.data?.botUser?.name} `,
          {
            duration: 10000,
            // position: "bottom-right",
            closeButton: true,
            description: `${data.data?.botUser?.mobile}/${data.data?.botUser?.email}`,
            action: {
              label: "View",
              onClick: () => {
                return navigateTo({
                  name: "analytics-leads-id",
                  params: { id: data.data?.chatId },
                });
              },
            },
          },
        );
      }

      // Update your component state with the received data
    };
    /*************  ✨ Codeium Command ⭐  *************/
    // Handle any errors that occur when receiving events, such as network errors
    // or parser errors.
    /******  5fd36ab0-c1a6-4a11-8f92-1cad8884cf1b  *******/
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close(); // Close the connection when the component unmounts
    };
  });

  const loading = ref(false);
  const router = useRouter();

  watch(
    () => router.currentRoute.value,
    (to, from) => {
      console.log(loading, "LOADING");
      loading.value = true;
      setTimeout(() => {
        loading.value = false; // Simulate loading completion after 1 second
      }, 1000);
    },
  );
</script>
