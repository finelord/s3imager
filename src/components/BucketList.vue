<template>
  <div>
    <input type="text" v-model="newBucketName" />
    <button @click="createBucket">Create bucket</button>
    <Container lock-axis="y" @drop="onDrop">
      <Draggable v-for="(bucket, index) in bucketList" :key="index">
        <div
          class="item"
          :class="{ active: selectedBucketName === bucket.name }"
          @click="selectBucket(bucket.name)"
        >
          {{ bucket.name }}
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';

export default {
  components: {
    Container,
    Draggable
  },
  data() {
    return {
      newBucketName: ''
    };
  },
  computed: {
    selectedBucketName() {
      return this.$store.state.bucketList.selectedItemName;
    },
    bucketList() {
      return this.$store.getters['bucketList/items'];
    }
  },
  methods: {
    createBucket() {
      this.$store.dispatch('bucketList/createItem', {
        bucketName: this.newBucketName
      });
    },
    selectBucket(bucketName) {
      this.$store.commit('bucketList/selectItem', { itemName: bucketName });
    },
    onDrop(data) {
      this.$store.dispatch('bucketList/updateItemsSortOrder', {
        fromIndex: data.removedIndex,
        toIndex: data.addedIndex
      });
    }
  },
  mounted() {
    this.$store.dispatch('bucketList/fetchItems');
  }
};
</script>

<style scoped>
.item {
  padding: 10px;
  border-right: 2px solid #22242626;
  cursor: pointer;
}
.active {
  font-weight: bold;
  border-right: 2px solid #1b1c1d;
}
</style>
