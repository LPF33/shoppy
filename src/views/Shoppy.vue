<template>
  <div class="shoppy-section" @click.self="setVisible">
    <h1>Shoppy</h1>
    <main>
      <section class="section-draggable" v-if="category === 'Supermarkt'">
        <VueDraggableNext
          v-model="supermarktItems"
          @change="onDrop"
          class="draggable-next"
        >
          <span v-for="it in supermarktItems" :key="it.key">🖐</span>
        </VueDraggableNext>
        <div>
          <ShoppingItem
            v-for="it in supermarktItems"
            :key="it.key"
            :item="it"
          />
        </div>
      </section>
      <section class="section-draggable" v-if="category === 'Drogerie'">
        <VueDraggableNext
          v-model="drogerieItems"
          @change="onDrop"
          class="draggable-next"
        >
          <span v-for="it in drogerieItems" :key="it.key">🖐</span>
        </VueDraggableNext>
        <div>
          <ShoppingItem v-for="it in drogerieItems" :key="it.key" :item="it" />
        </div>
      </section>
    </main>
    <AddItem
      v-if="visible"
      @close="setVisible"
      :index="index"
      :selected="category"
    />
    <div class="buttons" v-else>
      <button
        @click="switchCategory('Supermarkt')"
        :class="{ active: category === 'Supermarkt' }"
      >
        🧀
      </button>
      <button @click="setVisible">➕</button>
      <button
        @click="switchCategory('Drogerie')"
        :class="{ active: category === 'Drogerie' }"
      >
        🧴
      </button>
    </div>
  </div>
</template>

<script>
import AddItem from "@/components/AddItem";
import ShoppingItem from "@/components/ShoppingItem";
import { shoppyFirestore } from "@/firebase/config";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: "Shoppy",
  components: {
    AddItem,
    ShoppingItem,
    VueDraggableNext,
  },
  data() {
    return {
      supermarktItems: null,
      drogerieItems: null,
      category: "Supermarkt",
      visible: false,
      unsubscribe: null,
      index: 0,
    };
  },
  methods: {
    setVisible() {
      this.visible = !this.visible;
    },
    switchCategory(category) {
      this.category = category;
    },
    onDrop(e) {
      const { oldIndex, newIndex, element: draggedItem } = e.moved;
      const itemsList =
        draggedItem.category === "Supermarkt"
          ? [...this.supermarktItems]
          : [...this.drogerieItems];
      console.log(itemsList);
      let newDraggedIndex;
      if (newIndex === oldIndex) {
        return;
      }
      if (newIndex < oldIndex) {
        newDraggedIndex = itemsList[newIndex + 1].list_id;
        itemsList.forEach((item) => {
          if (
            item.list_id >= newDraggedIndex &&
            item.list_id !== draggedItem.list_id
          ) {
            item.list_id++;
            this.updateFirebase(item);
          }
        });
      } else {
        newDraggedIndex = itemsList[newIndex - 1].list_id;
        itemsList.forEach((item) => {
          if (
            item.list_id <= newDraggedIndex &&
            item.list_id !== draggedItem.list_id
          ) {
            item.list_id--;
            this.updateFirebase(item);
          }
        });
      }
      draggedItem.list_id = newDraggedIndex;
      this.updateFirebase(draggedItem);
    },
    async updateFirebase(item) {
      await shoppyFirestore
        .collection("shoppy")
        .doc(item.key)
        .update({ list_id: item.list_id });
    },
  },
  async created() {
    try {
      this.unsubscribe = shoppyFirestore.collection("shoppy").onSnapshot(
        (doc) => {
          let newDoc = doc.docs
            .map((item) => item.data())
            .sort((a, b) => a.list_id - b.list_id);
          this.supermarktItems = newDoc.filter(
            (item) => item.category === "Supermarkt"
          );
          this.drogerieItems = newDoc.filter(
            (item) => item.category === "Drogerie"
          );
          this.index = newDoc[newDoc.length - 1].list_id + 1;
        },
        (err) => console.log(err)
      );
    } catch (err) {
      console.log(err);
    }
  },
  unmounted() {
    if (typeof this.unsubscribe == "function") {
      this.unsubscribe();
    }
  },
};
</script>

<style scoped>
.shoppy-section {
  position: relative;
  background-color: #232323;
  width: 100%;
  height: 100%;
  color: #ffeda3;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  user-select: none;
}

h1 {
  margin: 10px 0;
  height: 1.5em;
}

main {
  position: absolute;
  top: calc(2rem + 20px);
  bottom: 8rem;
  max-width: 500px;
  width: 90vw;
  overflow-y: auto;
}

.section-draggable {
  display: flex;
}

.section-draggable > div:nth-child(2) {
  flex-grow: 1;
}

.draggable-next {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
}

.draggable-next span {
  font-size: 2rem;
  border-bottom: 1px solid transparent;
  line-height: 1.5em;
  cursor: move;
}

.buttons {
  position: absolute;
  bottom: 10px;
  margin-top: 2rem;
  display: flex;
  justify-content: space-evenly;
  max-width: 500px;
  width: 100vw;
}

button {
  height: 6rem;
  width: 6rem;
  font-size: 3rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

button.active {
  background-color: #ffeda3;
}
</style>