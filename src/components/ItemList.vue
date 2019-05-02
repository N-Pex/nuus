<template>
  <v-container class="ma-0 pa-0">
    <v-layout row wrap>
      <v-list>
        <Item v-for="item in items" :key="item.number" class="ma-3" :item="item"/>
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
  }
};
</script>
