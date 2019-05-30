<template>
  <v-container class="ma-0 pa-0 pt-3">
    <v-layout row wrap>
      <v-list>
        <Item v-for="(item, index) in items" :key="item.guid" class="ma-0" :item="item" :odd="index % 2 != 0" 
        v-on:itemClicked="itemClicked($event)"
        v-on:playItem="playItem($event)"
        />
      </v-list>
    </v-layout>
  </v-container>
</template>


<script>
import Item from "./Item";

export default {
  components: {
    Item
  },
  props: {
    items: {
      type: Array,
      // Object or array defaults must be returned from
      // a factory function
      default: function() {
        return [];
      }
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
