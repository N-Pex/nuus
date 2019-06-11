<template>
  <v-container fluid style="background-color: white" ma-0 pa-1>
    <v-layout text-xs-center wrap>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>share</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>play_circle_outline</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>cloud_download</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
          @click="toggleFavorite()"
        >
          <v-icon v-if="isFavorite">bookmark</v-icon>
          <v-icon v-else>bookmark_border</v-icon>
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
    var self = this;
    db.items.get(this.item.guid).then(item => this.isFavorite = item.favorite).catch(function() {});
  },
  data: () => ({
    isFavorite: false
  }),
  methods: {
        toggleFavorite() {
      const self = this;
      db.items.put({"id": this.item.guid, "favorite": !this.isFavorite})
      .then(item => {
        self.isFavorite = !self.isFavorite;
        })
        .catch(function() {});
    }
  }
};
</script>
