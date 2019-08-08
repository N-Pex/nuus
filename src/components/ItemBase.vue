<template></template>

<script>
import db from "../database";
import ItemModel from "../models/itemmodel";

export default {

  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    },
    odd: false
  },

  mounted: function() {
    var self = this;
    this.imageUrl = this.item.imageSrc;
  },
  data: () => ({
    imageUrl: null
  }),
  computed: {
    playable: function() {
      return this.item != null && (this.item.hasVideoAttachment() || this.item.hasAudioAttachment());
    },
    hasImage: function() {
      return this.imageUrl != null;
    },
  },
  methods: {
    onPlayStarted(item) {
      this.$emit("playStarted", item);
    },
    playItem() {
      this.$emit("playItem", {
        item: this.item
      });
    },
    itemClicked() {
      console.log("Item " + this.$refs.card.getBoundingClientRect());
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    }
  }
};
</script>

<style>
/* Special cleanup of the display */
a:empty {
  display: none;
}
br {
  content: ' ';
  display: none !important;
}
.itemBody p:last-of-type {
  margin-bottom: 0px;
}

</style>