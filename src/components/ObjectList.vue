<template>
  <Container @drop="onDrop">
    <Draggable v-for="(object, index) in objectList" :key="index">
      <div>{{ object.name }}</div>
      <img :src="`${baseUrl}/${bucketName}/${object.name}`" height="100px" />
    </Draggable>
  </Container>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';

export default {
  components: {
    Container,
    Draggable
  },
  computed: {
    baseUrl() {
      return this.$store.getters['context/baseUrl'];
    },
    bucketName() {
      return this.$store.state.bucketList.selectedItemName;
    },
    objectList() {
      return this.$store.getters['objectList/items'];
    }
  },
  watch: {
    bucketName(newName, oldName) {
      if (newName && newName !== oldName) {
        const payload = { bucketName: newName };
        this.$store.dispatch('objectList/fetchItems', payload);
      }
    }
  },
  methods: {
    onDrop(data) {
      this.$store.dispatch('objectList/updateItemsSortOrder', {
        bucketName: this.bucketName,
        fromIndex: data.removedIndex,
        toIndex: data.addedIndex
      });
    }
  },
  mounted() {
    if (this.bucketName) {
      const payload = { bucketName: this.bucketName };
      this.$store.dispatch('objectList/fetchItems', payload);
    }
  },
  destroyed() {
    this.$store.commit('objectList/clearItems');
  }
};
</script>

<style></style>
