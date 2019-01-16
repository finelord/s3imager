<template>
  <router-link
    class="item"
    active-class="active"
    :class="{
      'right': side === 'right'
    }"
    :to="to"
  >
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: 'TopNavbarRouterLink',
  props: ['to', 'side']
};
</script>

<style scoped>
.item {
  display: inline-block;
  padding: 10px;
  margin-bottom: -2px;
  border-bottom: 2px solid transparent;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.item.active {
  border-bottom-color: #1b1c1d;
}
.item.right {
  float: right;
}
</style>
