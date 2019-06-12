<template>
  <v-container class="ma-0 pa-0" ref="container">
    <v-layout row wrap>
      <v-list v-if="isMediaList" ref="list">
        <MediaItem
          v-for="(item, index) in items"
          :key="item.guid"
          :ref="item.guid"
          class="ma-0"
          :item="item"
          :isSelected="item == selectedItem"
          :odd="index % 2 != 0"
          v-on:itemClicked="itemClicked($event)"
          v-on:playItem="playItem($event)"
        />
      </v-list>
      <v-list v-else ref="list">
        <Item
          v-for="(item, index) in items"
          :key="item.guid"
          :ref="item.guid"
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
    items: function() {
      // Items changed, scroll to top!
      this.$refs.container.scrollTop = 0;
    },
    selectedItem: function() {
      const self = this;
      if (this.selectedItem != null) {
        this.$nextTick(function() {
          let list = self.$refs.list;
          let element =
            list.$children[self.items.indexOf(self.selectedItem)].$el;
          if (element != null) {
            element.scrollIntoView(true);
          }
        });
      }
    }
  },
  mounted() {},
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
