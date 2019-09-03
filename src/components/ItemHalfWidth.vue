<template>
  <div>
    <v-img
      :aspect-ratio="4/3"
      class="image ma-0 mb-2 pa-0 text-center"
      :src="imageSrc"
      @error="onError"
      v-on="!playable ? { click: itemClicked } : {}"
    >
      <v-layout pa-2 column fill-height class="lightbox white--text" justify-center>
        <v-flex shrink>
          <PlayButton
            v-if="playable"
            :item="item"
            :playerColor="'black'"
            showMediaPlayer
            v-on:playStarted="onPlayStarted($event)"
          />
        </v-flex>
      </v-layout>
    </v-img>

    <div @click="itemClicked()" ml-2 mr-2 mt-0 pt-0 xs12>
      <div class="itemTitle">{{ item.title }}</div>
      <div>
        <DateView class="itemDate verticalCenter" :date="item.pubDate" ago />&nbsp;
        <ItemType :item="item" />
      </div>
    </div>
  </div>
</template>


<script>
import ItemBase from "./ItemBase";
import ItemType from "./ItemType";
import db from "../database";
import ItemModel from "../models/itemmodel";
import DateView from "./DateView";
import PlayButton from "./PlayButton";

export default {
  extends: ItemBase,
  components: {
    DateView,
    PlayButton,
    ItemType
  },
  methods: {
    onError(e) {}
  }
};
</script>

<style scoped>
.contentBlock {
  display: block;
}

.imageContainer {
  display: grid;
}

.image {
  object-fit: cover;
  background-color: #efefef;
}
</style>
