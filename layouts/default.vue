<template>
  <div class="relavtive flex h-[100vh]">
    <div
      class="xl:felx w-[270px hidden h-[100vh] flex-col items-center gap-[20px] overflow-auto border-r border-[#8a8a8a1a] md:hidden lg:flex"
    >
      <NavigationDrawer />
    </div>
    <div
      class="main-router-align mt-2 w-full md:mt-0 lg:mt-0 lg:w-[86%] xl:mt-0"
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
<style scoped>
  .navigation-drawer {
    width: 270px;
    /* padding-right: 20px; */
    /* height: 100vh; */
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    overflow-y: scroll;
    /* background: rgba(138, 138, 138, 1); */
    border-right: 2px solid #8a8a8a1a;
  }
  .main-router-align {
    /* padding: 30px 10px; */
    /* padding: 0 0 15px 0; */
    height: 100vh;
    overflow-y: scroll;
  }
  .main-container-top-align {
    width: 100%;
    height: 70px;
    background: rgba(240, 246, 255, 1);
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 20px;
    /* position: fixed; */
    /* top: 100px; */
  }
  .bar-align {
    width: 1px;
    height: 40px;
    background-color: rgba(66, 75, 209, 1);
    /* padding: 5px 0; */
    /* border: 0.1px solid rgba(66, 75, 209, 1) */
  }
  .profile-align {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  }
</style>
