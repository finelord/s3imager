<template>
  <div class="image" :class="{ 'image--selected': isSelected }" @click="toggleSelection">
    <span class="image-label" :class="{ 'image-label--selected': isSelected }"></span>
    <div class="image-border" :class="{ 'image-border--selected': isSelected }"></div>
    <img :src="`${baseUrl}/${bucketName}/${imageGroup.previews['2x'].name}`" />
  </div>
</template>

<script>
export default {
  name: 'BucketImage',
  props: {
    bucketName: String,
    imageGroup: Object
  },
  computed: {
    baseUrl() {
      return this.$store.getters['context/baseUrl'];
    },
    isSelected() {
      return this.$store.getters['groupList/isItemSelected'](this.imageGroup.id);
    }
  },
  methods: {
    toggleSelection() {
      this.$store.commit('groupList/toggleItemSelection', { itemId: this.imageGroup.id });
    }
  }
};
</script>

<style scoped>
.image {
  position: relative;
  display: flex;
  width: 100%;
}
.image img {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  filter: grayscale(50%);
}
.image--selected img {
  opacity: 1;
  filter: none;
}
.image-border {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 2px solid #dedede;
}
.image-border--selected {
  border-color: #21ba45;
}
</style>
