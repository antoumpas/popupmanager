<template>
  <popup>
    <template #default="{ hideModal }">
      <article class="pm-create-modal">
        <main class="pm-create-modal__main">
          <p>Are you sure you want to delete '{{ title }}' ?</p>
        </main>
        <footer class="pm-create-modal__footer">
          <button @click="remove(hideModal)">Delete</button>
          <button @click="hideModal()">Cancel</button>
        </footer>
      </article>
    </template>
  </popup>
</template>

<script>
import Popup from "../Popup.vue";
import { dbPromise, deletePopup } from "../../database";

export default {
  components: { Popup },
  db: null,
  props: {
    popup: {
      default: null,
      type: Object,
    },
  },
  computed: {
    title() {
      if (!this.popup) {
        return ' - ';
      }
      return this.popup.title;
    },
  },
  methods: {
    async remove(callback) {
      try {
        if (this.popup) {
          await deletePopup(await this.getDb(), this.popup);
          this.$emit('delete');
        }
        callback();
      } catch (e) {
        this.$emit('error', e);
        console.error(e)
      }
    },
    async getDb() {
      if (!this.$options.db) {
        this.$options.db = await dbPromise;
      }
      return this.$options.db;
    },
  },
};
</script>

<style lang="scss">
.pm-create-modal {
  color: var(--color-text);
  &__main {
    padding: 1rem;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    & > * {
      margin: 0 0.25rem;
    }
    button {
      cursor: pointer;
      background: var(--color-accent);
      color: white;
      border-radius: 0.25rem;
      outline: none;
      border: none;
      padding: 1rem 1.5rem;
    }
  }
}
</style>
