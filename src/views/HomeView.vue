<template>
  <header class="pm-header">
    <nav class="pm-header__nav">
      <span class="pm-header__brand">Popup Manager</span>
      <ul>
        <li><a href="/demo">Demo</a></li>
      </ul>
    </nav>
  </header>
  <main class="pm-popups">
    <div class="pm-popups__header">
      <h1>Popups</h1>
      <button @click="openModifyModal(null)">Create</button>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Title</th>
          <th scope="col">Last trigger</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="popup.key" v-for="popup in popups">
          <td>{{ popup.key }}</td>
          <td>{{ popup.title }}</td>
          <td>{{ formatDate(popup.since) }}</td>
          <td>
            <button @click="openModifyModal(popup)">Edit</button>
            <button @click="openDeleteModal(popup)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <modify-popup
      @save="refresh"
      v-model="modifyModal.enabled"
      :popup="modifyModal.popup"
    />
    <delete-popup
      @delete="refresh"
      v-model="deleteModal.enabled"
      :popup="deleteModal.popup"
    />
  </main>
</template>

<script>
import { dbPromise, getAllPopups } from "../database";
import ModifyPopup from "../components/dashboard/ModifyPopup.vue";
import DeletePopup from "../components/dashboard/DeletePopup.vue";

export default {
  components: { ModifyPopup, DeletePopup },
  db: null,
  data() {
    return {
      isCreateModalOpen: false,
      deleteModal: {
        enabled: false,
        popup: null,
      },
      modifyModal: {
        enabled: false,
        popup: null,
      },
      popups: [],
    };
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-GB").format(date);
    },
    openModifyModal(popup) {
      this.modifyModal.enabled = true;
      this.modifyModal.popup = popup;
    },
    openDeleteModal(popup) {
      this.deleteModal.popup = popup;
      this.deleteModal.enabled = true;
    },
    async getDb() {
      if (!this.$options.db) {
        this.$options.db = await dbPromise;
      }
      return this.$options.db;
    },
    async refresh() {
      const db = await this.getDb();
      this.popups = await getAllPopups(db);
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>

<style lang="scss" scoped>
.pm-header {
  background: var(--color-background-heading);
  color: var(--color-text-heading);
  &__brand {
    color: var(--color-accent);
    font-size: 2rem;
    font-weight: 300;
  }
  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem;
    ul {
      list-style: none;
      padding: 0;
      li {
        a {
          text-transform: uppercase;
          text-decoration: none;
          color: var(--color-text-heading);
          &:hover {
            color: var(--color-accent);
          }
        }
      }
    }
  }
}
main {
  margin: 1rem auto;
  padding: 1rem;
  max-width: 1280px;
  background: var(--color-background);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-radius: 1rem;
}

.pm-popups {
  table {
    border-radius: 5px;
    font-size: 12px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
    th,
    td {
      text-align: left;
      button {
        margin: 0 0 0 0.25rem;
        padding: 0.5rem 1rem;
      }
    }
    th:nth-child(n + 3),
    td:nth-child(n + 3) {
      text-align: right;
    }
  }
  button {
    cursor: pointer;
    background: var(--color-accent);
    color: white;
    border-radius: 0.25rem;
    outline: none;
    border: none;
    padding: 0.75rem 1.25rem;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
