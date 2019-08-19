<template>
  <div class="ma-0 pa-0" ref="container">
    <v-list ref="list">
      <div
        v-for="(item, index) in items"
        :key="item.guid"
        style="background-color: var(--v-audioCardBackground-base)"
      >
        <AudioItem
          :ref="item.guid"
          class="ma-0"
          :item="item"
          :isSelected="item == selectedItem"
          v-on:itemClicked="playItem($event)"
          v-on:playItem="playItem($event)"
        />
        <!-- If not last item, add a divider between items -->
        <div v-if="index < items.length - 1" class="listDivider" />
      </div>
    </v-list>
  </div>
</template>


<script>
import ItemListBase from "./ItemListBase";
import AudioItem from "./AudioItem";
import ItemModel from "../models/itemmodel";

export default {
  extends: ItemListBase,
  components: {
    AudioItem
  }
};
</script>
