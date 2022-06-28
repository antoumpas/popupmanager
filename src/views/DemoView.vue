<template>
  <div class="grid responsive">
    <header class="item-1 header">Header
      <nav>
        <ul>
          <li>
            <a href="http://google.com/">link 1</a>
            <a href="#">link 2</a>
          </li>
        </ul>
      </nav>
    </header>
    <main class="item-2 content">
      Content <span>{{ timer }}s</span>
    </main>
    <aside class="item-3 aside">
      Aside
      <ul>
        <li><a href="http://google.com">External link</a></li>
      </ul>
    </aside>
    <div class="item-4 footer">Footer</div>
  </div>
  <PopupManager></PopupManager>
</template>

<script>
import PopupManager from "../components/PopupManager.vue";

export default {
  components: {
    PopupManager,
  },
  data() {
    return {
      isModalOpen: false,
      timer: 0,
    };
  },
  mounted() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);
  }
};
</script>

<style>
.grid {
  display: inline-grid;
  border: 0.1em solid;
  border-radius: 0.2em;
  font-size: 2em;
}

.grid > * {
  margin: 0.05em;
  border-width: 0.1em;
  border-style: solid;
  border-radius: 0.2em;
  padding: 0.5em;
  font-family: monospace;
}

.item-1 {
  background-color: rgba(242, 46, 138, 0.8);
  border-color: rgb(242, 46, 138);
}

.item-2 {
  background-color: rgba(98, 205, 217, 0.8);
  border-color: rgb(98, 205, 217);
}

.item-3 {
  background-color: rgba(117, 191, 6, 0.8);
  border-color: rgb(117, 191, 6);
}

.item-4 {
  background-color: rgba(242, 226, 5, 0.8);
  border-color: rgb(242, 226, 5);
}

.responsive {
  display: grid;
  height: 100%;
  box-sizing: border-box;
  grid-gap: 10px 20px;
  grid-template-rows: 100px 1fr auto;
  grid-template-columns: 1fr 200px;
  grid-template-areas:
    "header  header"
    "content aside "
    "footer  aside ";
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.header nav a {
  font-size: 1.5rem;
  margin: 0.5rem;
}

.content {
  height: 2000px;
  grid-area: content;
  display: flex;
  justify-content: space-between;
}

.aside {
  grid-area: aside;
}

.aside ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.aside ul a {
  font-size: 1rem;
  margin: 0.5rem;
}

.footer {
  grid-area: footer;
}

@media (max-width: 600px) {
  .responsive {
    grid-gap: 0;
    grid-template-rows: auto 1fr auto auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "header "
      "content"
      "aside  "
      "footer ";
  }
}
</style>
