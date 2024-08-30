<template>
  <div class="relavtive flex h-[100vh]">
    <div
      class="xl:felx w-[270px hidden h-[100vh] flex-col items-center gap-[20px] overflow-auto border-r border-[#8a8a8a1a] md:hidden lg:flex"
    >
      <NavigationDrawer />
    </div>
    <div
      class="mt-2 h-[100vh] w-full overflow-y-scroll md:mt-0 lg:mt-0 lg:w-[86%] xl:mt-0"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from "vue";

  const route = useRoute();
  const routeName = ref(route.name);
  onMounted(async () => {
    console.log(routeName, "routeName");
    const eventSource = new EventSource("http://localhost:3000/api/sse");
    // toast.success("Connection established", {
    //   position: "bottom-right",
    //   closeButton: true,
    // });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "leads") {
        console.log({ data });
        toast.success(
          `A new lead created generated -- ${data.data?.botUser?.name} `,
          {
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
