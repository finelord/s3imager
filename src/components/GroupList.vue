<template>
  <div class="container">
    <div class="top-actionbar">
      <ExportMeta/>
    </div>

    <div class="list">
      <Container @drop="onDrop">
        <Draggable v-for="group in groups" class="item" :key="group.id">
          <GroupListItem :bucketName="bucketName" :group="group"/>
        </Draggable>
      </Container>
    </div>

    <div class="invalid-list" v-if="invalidObjectList.length">
      <p>--- out of group ---</p>
      <div v-for="(object, index) in invalidObjectList" :key="index">
        <div>{{ object.name }}</div>
        <img :src="`${baseUrl}/${bucketName}/${object.name}`" height="100px">
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import ExportMeta from './ExportMeta';
import GroupListItem from './GroupListItem';

export default {
  components: {
    Container,
    Draggable,
    ExportMeta,
    GroupListItem
  },
  computed: {
    baseUrl() {
      return this.$store.getters['context/baseUrl'];
    },
    bucketName() {
      return this.$store.state.bucketList.selectedItemName;
    },
    groups() {
      return this.$store.getters['groupList/groups'];
    },
    invalidObjectList() {
      return this.$store.getters['groupList/invalidItems'];
    }
  },
  watch: {
    bucketName(newName, oldName) {
      if (newName !== oldName) {
        const payload = { bucketName: newName };
        this.$store.dispatch('groupList/fetchItems', payload);
      }
    }
  },
  methods: {
    onDrop(data) {
      this.$store.dispatch('groupList/updateItemsSortOrder', {
        bucketName: this.bucketName,
        fromIndex: data.removedIndex,
        toIndex: data.addedIndex
      });
    }
  },
  mounted() {
    if (this.bucketName) {
      const payload = { bucketName: this.bucketName };
      this.$store.dispatch('groupList/fetchItems', payload);
    }
  },
  destroyed() {
    this.$store.commit('groupList/clearItems');
  }
};
</script>

<style>
</style>
