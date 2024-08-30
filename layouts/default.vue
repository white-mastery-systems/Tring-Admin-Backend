<template>
  <div class="relavtive flex h-[100vh]">
    <div
      class="hidden md:hidden xl:felx lg:flex border-r border-[#8a8a8a1a] flex-col items-center gap-[20px] h-[100vh] overflow-auto w-[250px] overflow-x-hidden">
      <NavigationDrawer />
    </div>
    <!-- mt-2 -->
    <div class="lg:w-[86%] w-full xl:mt-0 lg:mt-0 md:mt-0 h-[100vh] overflow-y-scroll">

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
