<template>
  <div class="preset">
    <styled-form class="preset-container inline">
      <label class="preset-select">
        <span>Preset</span>
        <select v-model="preset">
          <option v-for="(preset, index) in presetsSortOrder" :value="preset" :key="index">
            {{ preset }}
          </option>
        </select>
      </label>
      <button class="preset-edit" @click="onPresetEdit">Edit</button>
      <button class="preset-add" @click="onPresetAdd">Add</button>
      <button class="preset-delete" @click="onPresetDelete">Delete</button>
    </styled-form>
    <div v-if="isEditMode">
      <input type="text" v-model="selectedPreset.name" />
      <div v-for="(config, index) in selectedPreset.value" :key="index">
        <div>
          <input type="text" v-model="config.id" />
          <label>
            <input type="checkbox" v-model="config.resize" />
            <span>resize</span>
          </label>
          <button @click="deleteConfig(config.id)">Delete</button>
        </div>
        <div v-if="config.resize">
          <select v-model="config.dimension">
            <option value="width">width</option>
            <option value="height">height</option>
            <option value="min">min</option>
            <option value="max">max</option>
          </select>
          <input type="number" min="1" v-model="config.value" />
        </div>
      </div>
      <div>
        <button @click="addConfig">Add</button>
      </div>
      <div>
        <button @click="onPresetClose">Close</button>
        <button @click="onPresetSave">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { StyledForm } from './lib/StyledForm';

export default {
  name: 'ObjectUploaderConfig',
  components: {
    StyledForm
  },
  data() {
    return {
      isEditMode: false,
      selectedPreset: undefined
    };
  },
  computed: {
    preset: {
      get() {
        return this.$store.state.objectUploaderConfig.selectedItemName;
      },
      set(presetName) {
        this.$store.commit('objectUploaderConfig/selectItem', { presetName });
        this.$store.dispatch('objectUploaderConfig/saveItems');
        this.updateSelectedPreset();
      }
    },
    presetsSortOrder() {
      return this.$store.getters['objectUploaderConfig/itemsSortOrder'];
    }
  },
  methods: {
    onPresetEdit() {
      this.updateSelectedPreset();
      this.isEditMode = true;
    },
    onPresetAdd() {
      this.$store.commit('objectUploaderConfig/addItem');
      this.updateSelectedPreset();
      this.isEditMode = true;
    },
    onPresetDelete() {
      this.isEditMode = false;
      this.$store.commit('objectUploaderConfig/deleteItem');
      this.$store.dispatch('objectUploaderConfig/saveItems');
    },
    onPresetSave() {
      this.$store.commit('objectUploaderConfig/updateItem', { preset: this.selectedPreset });
      this.$store.dispatch('objectUploaderConfig/saveItems');
      this.isEditMode = false;
    },
    onPresetClose() {
      this.isEditMode = false;
    },
    updateSelectedPreset() {
      const selectedPreset = this.$store.getters['objectUploaderConfig/selectedItem'];
      this.selectedPreset = {
        name: selectedPreset.name,
        value: [
          ...selectedPreset.value.map(item => ({ ...item })) // deep clone
        ]
      };
    },
    addConfig() {
      this.selectedPreset.value.push({
        id: '',
        resize: true,
        dimension: 'width',
        value: 500
      });
    },
    deleteConfig(configId) {
      this.selectedPreset = {
        ...this.selectedPreset,
        value: this.selectedPreset.value.filter(config => config.id !== configId)
      };
    }
  }
};
</script>

<style>
.preset {
  padding-top: 24px;
}
.preset-select {
  width: 100%;
  max-width: 200px;
}
</style>
