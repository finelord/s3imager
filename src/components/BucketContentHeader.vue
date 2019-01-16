<template>
  <div class="bucket-content-header">
    <h1 class="header">
      {{ bucketName }}
      <button @click="deleteBucket">Delete Bucket</button>
    </h1>
    <p class="subheader">Images: [count], groups: [count]</p>
  </div>
</template>

<script>
export default {
  name: 'BucketContentHeader',
  computed: {
    bucketName() {
      return this.$store.state.bucketList.selectedItemName;
    }
  },
  methods: {
    deleteBucket() {
      this.$store.dispatch('bucketList/deleteItem', { bucketName: this.bucketName });
    }
  }
};
</script>

<style scoped>
.bucket-content-header {
  margin-bottom: 16px;
}
.header {
  font-size: 24px;
  padding-top: 16px;
  padding-bottom: 8px;
}
.subheader {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
