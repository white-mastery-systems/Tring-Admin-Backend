<template>
  <div class="relavtive flex h-[100vh]">
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

  const route = useRoute();
  const routeName = ref(route.name);
  onMounted(async () => {
    console.log(routeName, "routeName");
    const eventSource = new EventSource("/api/sse");
    // toast.success("Connection established", {
    //   position: "bottom-right",
    //   closeButton: true,
    // });
    // toast.success(`A new lead created generated -- name `, {
    //   duration: 10000,
    //   // position: "bottom-right",
    //   closeButton: true,
    //   description: `mobile/phone`,
    //   action: {
    //     label: "View",
    //     onClick: () => {
    //       return navigateTo({
    //         name: "analytics-leads-id",
    //         params: { id: "123" },
    //       });
    //     },
    //   },
    // });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "leads") {
        console.log({ data });
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

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close(); // Close the connection when the component unmounts
    };
  });
</script>
