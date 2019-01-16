<template>
  <div class="form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'StyledForm'
};
</script>

<style scoped>
.form.inline > *:not(:last-child) {
  margin-right: 8px;
}
.form input[type='text'],
.form select {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
  outline: none;
}
.form button {
  display: inline-block;
  padding: 8px 16px;
  margin-bottom: 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: 0;
  font-size: 16px;
  text-align: center;
  vertical-align: baseline;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  background-color: transparent;
  box-shadow: 0 0 0 1px rgba(34, 36, 38, 0.15);
}
.form button:hover {
  color: rgba(0, 0, 0, 0.8);
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(34, 36, 38, 0.35);
}
.form button.primary {
  color: white;
  background-color: #2185d0;
  box-shadow: 0 0 0 0 rgba(34, 36, 38, 0.15) inset;
}
.form button.primary:hover {
  background-color: #1678c2;
}
.form select {
  height: 36px;
}
.form input:focus,
.form select:focus {
  color: rgba(0, 0, 0, 0.95);
  border-color: #85b7d9;
}
.form label {
  position: relative;
  display: block;
}
.form.inline label {
  display: inline-block;
}
.form label > span {
  position: absolute;
  top: -8px;
  left: 8px;
  background: white;
  font-size: 12px;
}
</style>
