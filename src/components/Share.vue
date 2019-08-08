<template>
  <v-container fluid ma-0 pa-1>
    <v-layout text-center wrap>
      <v-flex xs3>
        <v-btn class="tiny-button" text icon medium color="black">
          <v-icon>$vuetify.icons.share</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn class="tiny-button" text icon medium color="black">
          <v-icon>$vuetify.icons.facebook</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn class="tiny-button" text icon medium color="black">
          <v-icon>$vuetify.icons.download</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn class="tiny-button" text icon medium color="black" @click="toggleFavorite()">
          <v-icon v-if="isFavorite" color="green">$vuetify.icons.favorite</v-icon>
          <v-icon v-else color="black">$vuetify.icons.favoriteNot</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import flavors from "../config";
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
  mounted: function() {
    this.updateItem();
  },
  data: () => ({
    isFavorite: false
  }),
  watch: {
    item: function() {
      this.updateItem();      
    }
  },
  methods: {
    updateItem() {
      if (this.item != null) {
      db.items
        .get(this.item.guid)
        .then(item => (this.isFavorite = (item == null) ? false : item.favorite))
        .catch(function() {
          this.isFavorite = false;
        });
      } else {
        this.isFavorite = false;
      }
    },
    toggleFavorite() {
      const self = this;
      db.items
        .put({ id: this.item.guid, favorite: !this.isFavorite, item: this.item })
        .then(item => {
          self.isFavorite = !self.isFavorite;
        })
        .catch(function() {});
    }
  }
};
</script>
