import { ref } from "vue";

export const usePopup = (dismissable = true) => {
  const isVisible = ref(false);
  const target = ref<HTMLElement>();
  const open: EventListener = (openEvent) => {
    isVisible.value = true;
    if (dismissable) {
      const dismiss: EventListener = (dismissEvent) => {
        if (dismissEvent.target !== openEvent.target && !target.value?.contains(dismissEvent.target as Node)) {
          isVisible.value = false;
          window.removeEventListener('click', dismiss);
        }
      };
      window.addEventListener('click', dismiss);
    }
  }
  const close = () => isVisible.value = false;
  return {
    isVisible,
    target,
    open,
    close,
  }
};
