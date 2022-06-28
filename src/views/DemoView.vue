<template>
  <div class="grid responsive">
    <div class="item-1 header">Header</div>
    <div class="item-2 content">Content</div>
    <div class="item-3 aside">Aside</div>
    <div class="item-4 footer">Footer</div>
  </div>
  <popup
    v-model="isModalOpen"
    content="<div><h1>I'm a popup</h1><p>I have a body</p></div>"
  ></popup>
</template>

<script>
import Popup from "../components/Popup.vue";
export default {
  components: { Popup },
  data() {
    return {
      isModalOpen: true,
    };
  },
};
</script>

<style>
.grid {
  display: inline-grid;
  border: 0.1em solid;
  border-radius: 0.2em;
  font-size: 2em;
}

.grid > div {
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
}

.content {
  height: 2000px;
  grid-area: content;
}

.aside {
  grid-area: aside;
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
