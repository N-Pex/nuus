<template>
  <v-container fluid grid-list-sm pb-2 pt-0 pl-0 pr-0 mb-12>
    <v-layout
      ref="card"
      xs12
      style="background-color: var(--v-cardBackground-base)"
      justify-space-between
    >
      <v-flex
        grow
        mt-0
        pt-0
        v-if="hasImage || playable"
        v-bind:class="imageClassObject"
        style="width: 30%;max-width: var(--v-theme-title-line-height-scaled-x6);"
      >
        <div class="imageContainer">
          <div class="imageContainerContent">
            <div style="grid-column: 1; grid-row: 1" v-if="hasImage">
              <v-img :src="imageUrl" class="ma-0 pa-0 image" />
            </div>
            <div
              style="grid-column: 1; grid-row: 1; align-self: center"
              class="text-center"
              v-if="playable"
            >
              <PlayButton :item="item" :playerColor="hasImage ? 'white' : 'black'" showMediaPlayer v-on:playStarted="onPlayStarted($event)"/>
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex @click="itemClicked()" v-bind:class="textClassObject" ml-2 mr-2 mt-0 pt-0>
        <div class="itemTitle">{{ item.title }}</div>
        <div class="contentBlock mt-2">
          <div
            v-html="item.description"
            class="itemBody"
            style="max-height:var(--v-theme-body-line-height-scaled-x4);overflow:hidden"
          />
        </div>
        <div>
          <Date class="itemDate verticalCenter" :date="item.pubDate" ago />&nbsp;
          <span class="verticalCenter">
            <v-icon
              v-if="item.hasVideoAttachment()"
              class="ma-0 pa-0 tiny"
              small
            >$vuetify.icons.typeVideo</v-icon>
            <v-icon
              v-else-if="item.hasAudioAttachment()"
              class="ma-0 pa-0 tiny"
              small
            >$vuetify.icons.typeAudio</v-icon>
            <v-icon v-else class="ma-0 pa-0 tiny" small>$vuetify.icons.typeText</v-icon>
          </span>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import ItemBase from "./ItemBase";
import db from "../database";
import ItemModel from "../models/itemmodel";
import Date from "./Date";
import PlayButton from "./PlayButton";

export default {
  extends: ItemBase,
  components: {
    Date,
    PlayButton
  },

  computed: {
    imageClassObject: function() {
      var sort = 1;
      if (this.odd) {
        sort = 2;
      }
      let sortClass = "order-xs" + sort;
      let o = {};
      o[sortClass] = true;
      return o;
    },
    textClassObject: function() {
      var sort = this.hasImage || this.playable ? 2 : 1;
      if (this.odd) {
        sort = 1;
      }
      let sortClass = "order-xs" + sort;
      let o = {};
      o[sortClass] = true;
      return o;
    }
  }
};
</script>

<style scoped>
.contentBlock {
  display: block;
}

.imageContainer {
  position: relative;
  width: 100%;
  padding-top: 76%;
}

.imageContainerContent {
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  object-fit: cover;
}
</style>