<template>
  <div class="ma-0 pa-0" ref="container">
    <v-list ref="list" class="itemList">
      <VideoItem
        v-for="item in items"
        :key="item.guid"
        :ref="item.guid"
        class="ma-0"
        :item="item"
        :isSelected="item == selectedItem"
        v-on:itemClicked="playItem($event)"
        v-on:playItem="playItem($event)"
      />
    </v-list>
  </div>
</template>


<script>
import ItemListBase from "./ItemListBase";
import VideoItem from "./VideoItem";
import ItemModel from "../models/itemmodel";

export default {
  extends: ItemListBase,
  components: {
    VideoItem
  }
};
</script>
