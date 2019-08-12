<template>
  <div class="ma-0 pa-0" ref="container">
    <v-list ref="list" pa-0 ma-0>
      <v-container fluid grid-list-sm ma-0 pa-0>
        <v-layout ma-0 pa-0 xs12 row wrap justify-space-between>
          <v-flex class="xs12 pa-0"
            v-for="item in items"
            :key="item.guid"
          >
            <Item
              :ref="item.guid"
              class="ma-0 pa-2 mb-10"
              :item="item"
              :odd="false"
              :showFavorites="showFavorites"
              v-on:itemClicked="itemClicked($event)"
              v-on:playItem="playItem($event)"
              v-on:playStarted="onPlayStarted($event)"
              v-show="item.isFavorite"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-list>
  </div>
</template>


<script>
import ItemListBase from "./ItemListBase";
import Item from "./Item";
import ItemHalfWidth from "./ItemHalfWidth";
import ItemCategoryTitle from "./ItemCategoryTitle";
import ItemModel from "../models/itemmodel";

export default {
  extends: ItemListBase,
  components: {
    Item,
    ItemHalfWidth,
    ItemCategoryTitle
  },
  props: {
    showFavorites: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  }
};
</script>
