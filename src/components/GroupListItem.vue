<template>
  <div class="container">
    <div class="preview">
      <BucketImage :bucketName="bucketName" :imageGroup="group"/>
    </div>
    <div class="image-group">
      <span class="title">{{ group.name }}</span>
      <div class="items">
        <div v-for="item in group.items" :key="item.name">
          {{item.configId}} ({{item.width}}x{{item.height}})
          <button
            @click="deleteImage(group.id, item.name)"
          >Delete Image</button>
        </div>
      </div>
      <button @click="deleteGroup(group.id)">Delete Group</button>
    </div>
  </div>
</template>

<script>
import BucketImage from './BucketImage';

export default {
  name: 'GroupListItem',
  props: {
    bucketName: String,
    group: Object
  },
  components: {
    BucketImage
  },
  methods: {
    deleteImage(groupId, imageName) {
      this.$store.dispatch('groupList/deleteItem', {
        bucketName: this.bucketName,
        groupId,
        imageName
      });
    },
    deleteGroup(groupId) {
      this.$store.dispatch('groupList/deleteItemGroup', { bucketName: this.bucketName, groupId });
    }
  }
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 200px auto;
  grid-template-areas: 'preview imageGroup';
  grid-column-gap: 16px;
  margin-bottom: 16px;
}
.preview {
  grid-area: preview;
}
.image-group {
  grid-area: imageGroup;
}
.title {
  font-weight: bold;
}
</style>
