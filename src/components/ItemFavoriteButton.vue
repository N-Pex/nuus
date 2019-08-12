<template>
  <v-checkbox :ripple="{center: true}" class="ma-0 pa-0 text-center small align-center justify-center" v-model="isFavorite" hide-details on-icon="$vuetify.icons.favorite" off-icon="$vuetify.icons.favoriteNot" />
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
        this.item.isFavorite = false;
        db.items.where('id').equals(this.item.guid).delete();
      } else {
        this.item.isFavorite = true;
      db.items
        .put({
          id: this.item.guid,
          item: this.item
        })
        .catch(function(error) {
          console.log("DEXIE Error: " + error);
        });
      }
    },
    updateItem() {
      const self = this;
      db.items
        .get(this.item.guid)
        .then(item => self.isFavorite = item.item.isFavorite)
        .catch(function() {
          self.isFavorite = false;
        }).then(self.$nextTick(function() {
          console.log("Loaded. Fav is " + self.isFavorite);
          self.loaded = true;
        }));
    }
  }
};
</script>