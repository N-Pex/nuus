<template>
  <v-btn medium icon ma-0 pa-0 color="black" style="min-width: 0" @click="toggleFavorite()">
    <v-icon v-if="isFavorite" class="ma-0 pa-0 small" color="green">$vuetify.icons.favorite</v-icon>
    <v-icon v-else class="ma-0 pa-0 small" color="black">$vuetify.icons.favoriteNot</v-icon>
  </v-btn>
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
    }
  },
  mounted: function() {
    this.updateItem();
  },
  data: () => ({
    isFavorite: false
  }),
  methods: {
    // Toggle favorite status of item.
    toggleFavorite() {
      const self = this;
      const fav = !self.isFavorite;
      this.$nextTick(function() {
      db.items
        .put({
          id: this.item.guid,
          favorite: fav,
          item: this.item
        })
        .then(item => {
          self.isFavorite = fav;
        })
        .catch(function() {});
        });
    },
    updateItem() {
      db.items
        .get(this.item.guid)
        .then(item => (this.isFavorite = item.favorite))
        .catch(function() {});
    }
  }
};
</script>

