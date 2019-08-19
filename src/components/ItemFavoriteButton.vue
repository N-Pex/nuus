<template>
  <v-checkbox
    :ripple="{center: true}"
    class="ma-0 pa-0 text-center align-center justify-center"
    v-model="isFavorite"
    small
    hide-details
    on-icon="$vuetify.icons.favorite"
    off-icon="$vuetify.icons.favoriteNot"
  />
</template>


<script>
import ItemModel from "../models/itemmodel";
import db from "../database";

export default {
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },
  watch: {
    item: function() {
      this.updateItem();
    },
    isFavorite() {
      console.log("Updated isFavorite!!!");
      if (this.loaded) {
        this.storeFavorite(this.isFavorite);
      }
    }
  },
  mounted: function() {
    this.updateItem();
  },
  data: () => ({
    loaded: false,
    isFavorite: false
  }),
  methods: {
    // Toggle favorite status of item.
    storeFavorite(isFav) {
      console.log("Store favorite: " + isFav);
      const self = this;
      if (!isFav) {
        console.log("Delete");
        this.item.savedByUser = null;
        db.items
          .where("id")
          .equals(this.item.guid)
          .delete();
        this.item.cancelDownloadMedia();
        this.item.deleteDownloadedMedia();
      } else {
        this.item.savedByUser = Date.now();

        db.items
          .put({
            id: this.item.guid,
            item: this.item.serialize()
          })
          .catch(function(error) {
            console.log("DEXIE Error: " + error);
          });
        this.item.downloadMedia();
      }
    },
    updateItem() {
      const self = this;
      db.items
        .get(this.item.guid)
        .then(item => {
          self.isFavorite = ItemModel.fromString(item.item).savedByUser != null;
          self.$nextTick(function() {
            console.log("Set loaded = true");
            self.loaded = true;
          });
        })
        .catch(function() {
          self.isFavorite = false;
          self.$nextTick(function() {
            console.log("Set loaded = true");
            self.loaded = true;
          });
        });
    }
  }
};
</script>