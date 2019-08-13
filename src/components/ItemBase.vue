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

  destroyed: function() {
    if (this.imageBlobUrl != null) {
      var myURL = window.URL || window.webkitURL;
      console.log("Revoking: " + this.imageBlobUrl);
      myURL.revokeObjectURL(this.imageBlobUrl);
      this.imageBlobUrl = null;
    }
  },

  mounted: function() {
    var self = this;
    if (this.item != null && this.item.imageSrc != null) {
      db.getMediaFile(this.item.imageSrc).then(function (blob) {
      if (blob == null) {
        console.log("Not saved, return: " + self.item.imageSrc);
        self.imageUrl = self.item.imageSrc;
      } else {
        var myURL = window.URL || window.webkitURL;
        let url = myURL.createObjectURL(blob.blob);
        self.imageBlobUrl = url;
        console.log("Saved, return: " + self.imageBlobUrl);
      }
    });
    } else {
      this.imageUrl = null;
    }
  },
  data: () => ({
    imageUrl: null,
    imageBlobUrl: null
  }),
  computed: {
    playable: function() {
      return this.item != null && (this.item.hasVideoAttachment() || this.item.hasAudioAttachment());
    },
    hasImage: function() {
      return this.item != null && this.item.imageSrc != null;
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
      var rect = null;
      if (this.$refs.card != null) {
        rect = this.$refs.card.getBoundingClientRect();
      }
      this.$emit("itemClicked", {
        item: this.item,
        rect: rect
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