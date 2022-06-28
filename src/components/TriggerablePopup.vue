<template>
  <popup :modelValue="modelValue" @update:modelValue="toggle">
    <template #default="{ hideModal }">
      <slot v-bind="{ hideModal }"></slot>
    </template>
  </popup>
</template>

<script>
import Popup from "./Popup.vue";
import throttle from "lodash.throttle";
import {
  abortableSetTimeout,
  isTouchDevice,
  fastScrollingTop,
  getScrollPositionInPercentage,
} from "../helpers";

const triggerRegistrationWarning = (details) => {
  const warningMessage = "Could not register delay trigger.";
  console.warn(`${warningMessage} ${details}`);
};

export default {
  name: "triggerable-popup",
  abortController: null,
  components: { Popup },
  props: {
    modelValue: {
      required: true,
      type: Boolean,
    },
    triggers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      abortController: new AbortController(),
    };
  },
  methods: {
    toggle(payload) {
      this.$emit("update:modelValue", payload);
    },
    trigger() {
      this.toggle(true);
      this.clearEventListeners();
    },
    checkScroll(position) {
      if (position < getScrollPositionInPercentage()) {
        this.trigger();
      }
    },
    registerTriggers() {
      this.triggers.forEach((trigger) => {
        if (trigger.type === "delay") {
          this.registerDelayTrigger(trigger.options);
        } else if (trigger.type === "scroll") {
          this.registerScrollTrigger(trigger.options);
        } else if (trigger.type === "exit-intent") {
          this.registerExitIntentTrigger(trigger.options);
        } else {
          triggerRegistrationWarning("Unsupported type.");
        }
      });
    },
    registerDelayTrigger(options) {
      if (!options.seconds || isNaN(options.seconds)) {
        triggerRegistrationWarning("Invalid options (seconds).");
        return;
      }
      abortableSetTimeout(
        this.trigger,
        options.seconds * 1000,
        this.abortController.signal
      );
    },
    registerScrollTrigger(options) {
      if (!options.percentage || isNaN(options.percentage)) {
        triggerRegistrationWarning("Invalid options (percentage).");
        return;
      }

      // Run onScroll at the beginning for the case that the content is smaller than the than screen height.
      this.checkScroll(options.percentage);
      window.addEventListener(
        "scroll",
        throttle(() => {
          this.checkScroll(options.percentage);
        }, 500),
        {
          signal: this.abortController.signal,
        }
      );
    },
    registerExitIntentTrigger() {
      if (isTouchDevice()) {
        this.registerScrollSpeedListener();
      }
      this.registerMouseOutListener();
      this.registerNavLinkHoverListener();
      this.registerOnBeforeUnloadListener();
    },
    registerNavLinkHoverListener() {
      document.querySelectorAll("nav a").forEach((element) => {
        element.addEventListener("mouseover", this.trigger, {
          signal: this.abortController.signal,
        });
      });
    },
    registerMouseOutListener() {
      window.addEventListener(
        "mouseout",
        (event) => {
          if (!event.toElement && !event.relatedTarget) {
            this.trigger();
          }
        },
        { signal: this.abortController.signal, capture: true }
      );
    },
    registerScrollSpeedListener() {
      window.addEventListener(
        "scroll",
        throttle(fastScrollingTop(this.trigger), 500),
        {
          signal: this.abortController.signal,
        }
      );
    },
    registerOnBeforeUnloadListener() {
      window.addEventListener(
        "beforeunload",
        (event) => {
          event.preventDefault();
          // workaround for chrome and edge @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
          event.returnValue = "";
          this.trigger();
        },
        { signal: this.abortController.signal }
      );
    },
    clearEventListeners() {
      this.abortController.abort();
    },
  },
  mounted() {
    this.registerTriggers();
  },
  beforeUnmount() {
    this.clearEventListeners();
  },
};
</script>
