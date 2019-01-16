<template>
  <div class="container">
    <top-navbar>
      <top-navbar-router-link :to="{ name: 'logout' }" side="right">Logout</top-navbar-router-link>
    </top-navbar>
    <div class="bucket-list">
      <BucketList/>
    </div>
    <div class="bucket-content">
      <BucketContent/>
    </div>
  </div>
</template>

<script>
import { TopNavbar, TopNavbarRouterLink } from '@/components/lib/TopNavbar';
import BucketList from '@/components/BucketList';
import BucketContent from '@/components/BucketContent';

export default {
  name: 'ObjectStorageManager',
  components: {
    TopNavbar,
    TopNavbarRouterLink,
    BucketList,
    BucketContent
  },
  mounted() {
    this.$store.dispatch('objectUploaderConfig/fetchItems');
  }
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 300px auto;
  grid-template-areas:
    'topNavbar topNavbar'
    'bucketList bucketContent';
  grid-column-gap: 32px;
  margin-left: 16px;
  margin-right: 16px;
}
.top-navbar {
  grid-area: topNavbar;
}
.bucket-list {
  grid-area: bucketList;
}
.bucket-content {
  grid-area: bucketContent;
}
</style>
