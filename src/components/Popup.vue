<template>
  <dialog ref="popup" class="popup">
    <article class="popup__content">
      <header class="popup__header">
        <button @click="hideModal">Close</button>
      </header>
      <main class="popup__main" v-html="content"></main>
    </article>
  </dialog>
</template>

<script>
export default {
  name: "popup",
  props: {
    content: {
      required: true,
      type: String,
    },
    modelValue: {
      required: true,
      type: Boolean,
    },
  },
  watch: {
    modelValue: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        newValue ? this.showModal() : this.hideModal();
      },
    },
  },
  computed: {
    popup() {
      return this.$refs.popup;
    },
  },
  methods: {
    showModal() {
      if (this.popup && this.popup.showModal) {
        this.popup.showModal();
        this.$emit("update:modelValue", true);
      }
    },
    hideModal() {
      if (this.popup && this.popup.close) {
        this.popup.close();
        this.$emit("update:modelValue", false);
      }

    },
  },
  mounted() {
    this.modelValue ? this.showModal() : this.hideModal()
  }
};
</script>

<style lang="scss">
.popup {
  width: clamp(600px, 50%, 100%);
  &::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
  &__header {
    display: flex;
    justify-content: flex-end;
    button {
      border: none;
      outline: none;
      text-transform: uppercase;
      background: transparent;
      cursor: pointer;
    }
  }
}
</style>
