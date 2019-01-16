<template>
  <div class="top-navbar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TopNavbar'
};
</script>

<style scoped>
.top-navbar {
  border-bottom: 2px solid #22242626;
}
</style>
