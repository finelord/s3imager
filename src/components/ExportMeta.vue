<template>
  <button @click="handleExportJson">Export JSON</button>
</template>

<script>
export default {
  computed: {
    baseUrl() {
      return this.$store.getters['context/baseUrl'];
    },
    bucketName() {
      return this.$store.state.bucketList.selectedItemName;
    },
    groupList() {
      return this.$store.getters['groupList/selectedItems'];
    }
  },
  methods: {
    handleExportJson() {
      const exportObject = this.groupList.map(group => ({
        title: null,
        images: this.buildImages(group)
      }));
      this.$clipboard(JSON.stringify(exportObject, null, 2));
    },
    buildImages(images) {
      const imagesByConfigId = {};
      images.forEach(
        image =>
          (imagesByConfigId[image.configId] = {
            src: `${this.baseUrl}/${this.bucketName}/${image.name}`,
            w: image.width,
            h: image.height
          })
      );
      return imagesByConfigId;
    }
  }
};
</script>

<style></style>
