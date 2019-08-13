<template>
  <v-container fluid grid-list-sm>
    <v-layout
      ref="card"
      xs12
      style="background-color: var(--v-cardBackground-base)"
      justify-space-between
    >
      <v-flex shrink style="min-width: var(--v-theme-image-width)" mt-0 pt-0 v-if="hasImage || playable" v-bind:class="imageClassObject">
        <v-img
          :aspect-ratio="4/3"
          class="image ma-0 mb-2 pa-0 text-center"
          :src="imageBlobUrl != null ? imageBlobUrl : (imageUrl == null ? '' : imageUrl)"
          @error="onError"
          style="height: var(--v-theme-image-height);width: var(--v-theme-image-width);"
        >
          <v-layout pa-2 column fill-height class="lightbox white--text" justify-center>
            <v-flex shrink>
              <PlayButton
                v-if="playable"
                :item="item"
                :playerColor="hasImage ? 'white' : 'black'"
                showMediaPlayer
                v-on:playStarted="onPlayStarted($event)"
              />
            </v-flex>
          </v-layout>
        </v-img>
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
          <DateView class="itemDate verticalCenter" :date="item.pubDate" ago />&nbsp;
          <ItemType :item="item" />
        </div>
      </v-flex>

      <v-flex order-xs3 v-if="showFavorites">
        <ItemFavoriteButton :item="item" />
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import ItemBase from "./ItemBase";
import ItemType from "./ItemType";
import ItemFavoriteButton from "./ItemFavoriteButton";
import db from "../database";
import ItemModel from "../models/itemmodel";
import DateView from "./DateView";
import PlayButton from "./PlayButton";

export default {
  extends: ItemBase,
  components: {
    DateView,
    PlayButton,
    ItemType,
    ItemFavoriteButton
  },
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    },
    showFavorites: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  methods: {
    onError(e) {}
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
  object-fit: cover;
  background-color: #efefef;
}
</style>
