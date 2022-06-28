<template>
  <template v-for="popup in popups" :key="popup.key">
    <triggerable-popup
      :modelValue="handlers[popup.key]"
      @update:modelValue="toggle(popup.key, $event)"
      :triggers="popup.triggers"
    >
      <div v-html="popup.content"></div>
    </triggerable-popup>
  </template>
</template>
<script>
import TriggerablePopup from "./TriggerablePopup.vue";
import { dbPromise, getAllPopups, updatePopup } from "../database";
import { nextTrigger } from "../helpers";
import { toRaw } from "vue";

export default {
  name: "popup-manager",
  components: { TriggerablePopup },
  data() {
    return {
      handlers: {},
      popups: [],
    };
  },
  db: null,
  methods: {
    async getDb() {
      if (!this.$options.db) {
        this.$options.db = await dbPromise;
      }
      return this.$options.db;
    },
    async toggle(key, status) {
      if (this.handlers[key] === status) {
        return;
      }

      if (status) {
        this.closeAll();
        const popup = this.getPopupByKey(key);
        popup.since = new Date();
        await updatePopup(await this.getDb(), toRaw(popup));
      }
      this.handlers[key] = status;
    },
    getPopupByKey(key) {
      return this.popups.find((popup) => key === popup.key);
    },
    closeAll() {
      for (const handler in this.handlers) {
        this.handlers[handler] = false;
      }
    },
    isActive(popup) {
      if (!popup.since) {
        return true;
      }
      const now = new Date();
      const nextTriggerDate = nextTrigger(popup.since, popup.frequency);
      return nextTriggerDate < now;
    },
  },
  async created() {
    const db = await this.getDb();
    this.popups = (await getAllPopups(db)).filter(this.isActive);
    this.popups.forEach((popup) => {
      this.handlers[popup.key] = false;
    });
  },
};
</script>
