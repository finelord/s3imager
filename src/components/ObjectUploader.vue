<template>
  <div>
    <object-uploader-config></object-uploader-config>
    <div>
      <input type="file" @change="handleFileSelect" multiple />
      <button @click="handleFileUpload">upload</button>
    </div>
    <Container @drop="onDrop">
      <Draggable v-for="(preview, index) in previews" :key="index">
        <div>
          <img :src="preview" height="100px" />
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import ObjectUploaderConfig from '@/components/ObjectUploaderConfig';

export default {
  components: {
    Container,
    Draggable,
    ObjectUploaderConfig
  },
  computed: {
    bucketName() {
      return this.$store.state.bucketList.selectedItemName;
    },
    previews() {
      return this.$store.getters['objectUploader/previews'];
    },
    preset() {
      return this.$store.getters['objectUploaderConfig/selectedItem'];
    }
  },
  methods: {
    handleFileSelect(e) {
      this.$store.dispatch('objectUploader/readFiles', { files: Array.from(e.target.files) });
    },
    handleFileUpload: async function() {
      this.$store.dispatch('objectUploader/uploadImages', {
        bucketName: this.bucketName,
        configSet: this.preset
      });
    },
    onDrop(data) {
      this.$store.commit('objectUploader/updateImagesSortOrder', {
        fromIndex: data.removedIndex,
        toIndex: data.addedIndex
      });
    }
  }
};
</script>

<style></style>
