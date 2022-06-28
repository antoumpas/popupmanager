<template>
  <popup>
    <template #default="{ hideModal }">
      <article class="pm-create-modal">
        <main class="pm-create-modal__main">
          <form class="pm-create-modal__form">
            <div class="pm-create-modal__form-group">
              <h2>Popup information</h2>
              <label class="pm-create-modal__input">
                <span>Title</span>
                <input v-model="form.title" type="text" placeholder="Title" />
              </label>
              <label class="pm-create-modal__input">
                <span>Content</span>
                <textarea v-model="form.content" cols="30" rows="10"></textarea>
              </label>
            </div>
            <div class="pm-create-modal__form-group">
              <h2>Automatically show</h2>
              <div>
                <label
                  class="pm-create-modal__input pm-create-modal__input--with-checkbox"
                >
                  <input v-model="form.delay.enabled" type="checkbox" />
                  Show on a timer
                  <select v-model="form.delay.value">
                    <option value="30">After 30 seconds</option>
                    <option value="60">After 1 minute</option>
                  </select>
                </label>
                <label
                  class="pm-create-modal__input pm-create-modal__input--with-checkbox"
                >
                  <input v-model="form.scroll.enabled" type="checkbox" />
                  Show after scrolling
                  <select v-model="form.scroll.value">
                    <option value="25">25% of the page</option>
                    <option value="50">50% of the page</option>
                  </select>
                </label>
                <label
                  class="pm-create-modal__input pm-create-modal__input--with-checkbox"
                >
                  <input
                    v-model="form['exit-intent'].enabled"
                    type="checkbox"
                  />
                  Show on exit-intent
                </label>
              </div>
            </div>
            <div class="pm-create-modal__form-group">
              <h2>Trigger At most every</h2>
              <label class="pm-create-modal__input">
                <select v-model="form.frequency">
                  <option value="1">Every day</option>
                  <option value="7">Every week</option>
                  <option value="30">Every month</option>
                </select>
              </label>
            </div>
          </form>
        </main>
        <footer class="pm-create-modal__footer">
          <button :disabled="v$.form.$invalid" @click="save(hideModal)">Save</button>
          <button @click="hideModal()">Cancel</button>
        </footer>
      </article>
    </template>
  </popup>
</template>

<script>
import Popup from "../Popup.vue";
import { dbPromise, createPopup, updatePopup } from "../../database";

import useVuelidate from "@vuelidate/core";
import { required, minLength, numeric } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  components: { Popup },
  db: null,
  props: {
    popup: {
      type: Object,
    },
  },
  watch: {
    popup: {
      immediate: true,
      handler() {
        if (!this.popup) {
          this.form.content = null;
          this.form.title = null;
          this.form.frequency = null;
          this.form.delay = { enabled: false, value: 30 };
          this.form.scroll = { enabled: false, value: 25 };
          this.form["exit-intent"] = { enabled: false, value: null };
        } else {
          this.form.content = this.popup.content;
          this.form.title = this.popup.title;
          this.form.frequency = this.popup.frequency.value;
          this.form.delay = { enabled: false, value: 30 };
          this.form.scroll = { enabled: false, value: 25 };
          this.form["exit-intent"] = { enabled: false, value: null };
          this.popup.triggers.forEach((trigger) => {
            let value = null;
            if (trigger.type === "delay") {
              value = trigger.options.seconds;
            } else if (trigger.type === "scroll") {
              value = trigger.options.percentage;
            }
            this.form[trigger.type] = { enabled: true, value };
          });
        }
      },
    },
  },
  data() {
    return {
      form: {
        title: null,
        content: null,
        frequency: 7,
        delay: { enabled: false, value: 30 },
        scroll: { enabled: false, value: 25 },
        "exit-intent": { enabled: false, value: null },
      },
    };
  },
  methods: {
    async save(callback) {
      if (this.v$.form.$invalid) {
        window.alert('Invalid form.')
        return;
      }
      try {
        await this.storeToDB(this.generatePopupObject());
        this.$emit("save");
        callback();
      } catch (e) {
        this.$emit("error", e);
        console.error(e);
      }
    },
    async storeToDB(object) {
      if (!this.popup) {
        await createPopup(await this.getDb(), object);
      } else {
        await updatePopup(await this.getDb(), {
          ...object,
          key: this.popup.key,
        });
      }
    },
    async getDb() {
      if (!this.$options.db) {
        this.$options.db = await dbPromise;
      }
      return this.$options.db;
    },
    generatePopupObject() {
      const triggers = ["delay", "scroll", "exit-intent"]
        .filter((trigger) => {
          return this.form[trigger].enabled;
        })
        .map((trigger) => {
          const options = {};
          if (trigger === "delay") {
            options.seconds = this.form[trigger].value;
          } else if (trigger === "scroll") {
            options.percentage = this.form[trigger].value;
          }
          return { type: trigger, options };
        });
      return {
        content: this.form.content,
        title: this.form.title,
        since: null,
        frequency: {
          value: this.form.frequency,
          type: "days",
        },
        triggers,
      };
    },
  },
  validations() {
    return {
      form: {
        title: {
          required,
        },
        content: {
          required,
        },
        frequency: { required, numeric },
      },
    };
  },
};
</script>

<style lang="scss">
.pm-create-modal {
  color: var(--color-text);
  &__main {
    padding: 1rem;
  }
  &__form {
    &-group {
      h2 {
        font-size: 1.125rem;
        color: var(--color-background-heading);
        border-bottom: 1px solid var(--color-background-heading);
      }
    }
  }
  &__input {
    display: block;
    input,
    textarea,
    select {
      font-size: 1rem;
      display: block;
      border: 2px solid var(--color-primary);
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      margin: 1rem 0;
    }
    &--with-checkbox {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      & > * {
        margin: 0 1rem !important;
      }
    }
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    & > * {
      margin: 0 0.25rem;
    }
    button {
      background: var(--color-accent);
      color: white;
      border-radius: 0.25rem;
      outline: none;
      border: none;
      padding: 1rem 1.5rem;
      &:disabled {
        background: lightgray;
      }
    }
  }
}
</style>
