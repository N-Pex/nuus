<template>
  <div class="ma-0 pa-0" ref="container">
    <v-list ref="list" pa-0 ma-0>
      <v-container fluid grid-list-sm ma-0 pa-0>
        <v-layout ma-0 pa-0 xs12 row wrap justify-space-between>
          <v-flex
            v-bind:class="classesForIndex(index)"
            v-for="(item, index) in items"
            :key="item.guid"
          >
            <ItemHalfWidth
              v-if="!plain && (index == 1 || index == 2)"
              :ref="item.guid"
              class="ma-0 pa-2"
              :item="item"
              :odd="!plain && index > 2 && index % 2 == 0"
              v-on:itemClicked="itemClicked($event)"
              v-on:playItem="playItem($event)"
              v-on:playStarted="onPlayStarted($event)"
            />
            <Item
              v-else-if="index != 0 || plain"
              :ref="item.guid"
              class="ma-0 pa-2"
              :item="item"
              :odd="!plain && index > 2 && index % 2 == 0"
              v-on:itemClicked="itemClicked($event)"
              v-on:playItem="playItem($event)"
              v-on:playStarted="onPlayStarted($event)"
            />
            <ItemCategoryTitle
              v-else
              :ref="item.guid"
              class="ma-0 mb-10"
              :item="item"
              :odd="false"
              v-on:itemClicked="itemClicked($event)"
              v-on:playItem="playItem($event)"
              v-on:playStarted="onPlayStarted($event)"
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
    /**
     * Set this to "true" to only show a plain list.
     */
    plain: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    classesForIndex(index) {
      let o = {};
      if (index == 0 || this.plain) {
        o["xs12"] = true;
      } else if (index == 1 || index == 2) {
        o["xs6"] = true;
      } else {
        o["xs12"] = true;
      }
      o["pa-0"] = true;
      return o;
    }
  }
};
</script>
