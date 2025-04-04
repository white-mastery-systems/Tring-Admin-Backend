<!-- <template>
  <div class="relavtive flex h-[100vh] overflow-hidden">
    <div
      class="xl:felx hidden h-[100vh] min-w-[250px] max-w-[250px] flex-col items-center gap-[20px] overflow-auto overflow-x-hidden border-r border-[#8a8a8a1a] md:hidden lg:flex"
    >
      <NavigationDrawer />
    </div>
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
      loading.value = true;
      setTimeout(() => {
        loading.value = false; // Simulate loading completion after 1 second
      }, 1000);
    },
  );
</script> -->

<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/AppSidebar.vue";
import { MailIcon, Bell } from 'lucide-vue-next';
import { useUser } from '~/composables/auth'
import { useOrgDetailsStore } from "~/store/orgDetailsStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { UserIcon } from 'lucide-vue-next';
import { useBreadcrumbStore } from "~/store/breadcrumbs";
import { storeToRefs } from "pinia";
import { botStore } from "~/store/botStore"; // Import Pinia store
import { useRouter } from "vue-router";

const { user, clearUser } = await useUser();
const slideBarStore = botStore();
const userInfo = computed(() => {
  return user.value;
});
const OrgDetails = useOrgDetailsStore();
const avatarValue = ref(OrgDetails.values?.logo || userInfo.value?.profile_image)


const breadcrumbStore = useBreadcrumbStore();
const { breadcrumbs } = storeToRefs(breadcrumbStore);

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
const sliderBarControl = () => {
  slideBarStore.siderBarslider = !slideBarStore.siderBarslider
}
</script>

<template>
  <!-- style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;" -->
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full h-full">
      <div class="flex items-center h-10 shadow-none px-6 gap-2 border-b-[1px] border-[#E4E4E7] py-2">
        <!-- class="flex sm:flex md:hidden" -->
        <div class="flex items-center text-[12px]">
          <UiSidebarTrigger @click="sliderBarControl()" class="text-[#334155] py-2" />
        </div>
        <UiSeparator orientation="vertical" class="bg-[#E2E8F0]" />
        <!-- {{ breadcrumbs }} -->
        <BreadCrumbs :bread-crumbs="breadcrumbs" />
        <div class="flex items-center gap-5">
          <!-- <span class="flex items-center gap-4">
            <MailIcon class="w-4 h-4 text-gray-700" />
            <Bell class="w-4 h-4 text-gray-700" />
          </span> -->
          <!-- <Avatar class="h-10 w-10 rounded-circel bg-[#000000]">
            <AvatarFallback class="rounded-lg text-white">
              <UserIcon class="w-4 h-4" />
            </AvatarFallback>
          </Avatar> -->
        </div>
      </div>
      <div>
      </div>
      <slot />
    </main>
  </SidebarProvider>
</template>