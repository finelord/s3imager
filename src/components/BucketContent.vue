<template>
  <div>
    <bucket-content-header></bucket-content-header>
    <top-navbar>
      <top-navbar-router-link :to="{ name: 'groupList' }">Group List</top-navbar-router-link>
      <top-navbar-router-link :to="{ name: 'objectList' }">Object List</top-navbar-router-link>
      <top-navbar-router-link :to="{ name: 'objectUploader' }">
        Object Uploader
      </top-navbar-router-link>
    </top-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import BucketContentHeader from '@/components/BucketContentHeader';
import { TopNavbar, TopNavbarRouterLink } from '@/components/lib/TopNavbar';

export default {
  name: 'BucketContent',
  components: {
    BucketContentHeader,
    TopNavbar,
    TopNavbarRouterLink
  }
};
</script>

<style scoped></style>
