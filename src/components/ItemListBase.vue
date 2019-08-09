<template></template>

<script>
import ItemModel from "../models/itemmodel";

export default {
  props: {
    items: {
      type: Array,
      // Object or array defaults must be returned from
      // a factory function
      default: function() {
        return [];
      }
    },
    selectedItem: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },
  watch: {
    items: function() {
      // Items changed, scroll to top!
      this.$refs.container.scrollTop = 0;
    },
    selectedItem: function() {
      const self = this;
      if (this.selectedItem != null) {
        this.$nextTick(function() {
          let list = self.$refs.list;
          let element =
            list.$children[self.items.indexOf(self.selectedItem)].$el;
          if (element != null) {
            self.$el.scrollTop = Math.floor (element.offsetTop);
          }
        });
      }
    }
  },
  mounted() {},
  methods: {
    itemClicked(eventInfo) {
      this.$emit("itemClicked", eventInfo);
    },
    playItem(eventInfo) {
      this.$emit("playItem", eventInfo);
    },
    onPlayStarted(eventInfo) {
      this.$emit("playStarted", eventInfo);
    }
  }
};
</script>
