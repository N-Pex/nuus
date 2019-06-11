<template>
  <v-container class="ma-0 pa-0 pt-3">
    <v-layout row wrap>
      <v-list v-if="isMediaList">
        <MediaItem
          v-for="(item, index) in items"
          :key="item.guid"
          class="ma-0"
          :item="item"
          :isSelected="item == selectedItem"
          :odd="index % 2 != 0"
          v-on:itemClicked="itemClicked($event)"
          v-on:playItem="playItem($event)"
        />
      </v-list>
      <v-list v-else>
        <Item
          v-for="(item, index) in items"
          :key="item.guid"
          class="ma-0"
          :item="item"
          :odd="index % 2 != 0"
          v-on:itemClicked="itemClicked($event)"
          v-on:playItem="playItem($event)"
        />
      </v-list>
    </v-layout>
  </v-container>
</template>


<script>
import Item from "./Item";
import MediaItem from "./MediaItem";
import ItemModel from "../models/itemmodel";

export default {
  components: {
    Item,
    MediaItem,
    ItemModel
  },
  props: {
    isMediaList: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
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
    selectedItem: function() {
      console.log("Changed selected item");
    }
  },
  methods: {
    itemClicked(eventInfo) {
      this.$emit("itemClicked", eventInfo);
    },
    playItem(eventInfo) {
      this.$emit("playItem", eventInfo);
    }
  }
};
</script>
