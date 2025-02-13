import { ref, onMounted, onUnmounted } from "vue";

export function useScreenSize() {
  const isMobile = ref(false);

  const updateScreenSize = () => {
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    updateScreenSize(); // Set initial value
    window.addEventListener("resize", updateScreenSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateScreenSize);
  });

  return { isMobile };
}
