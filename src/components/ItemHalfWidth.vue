<template>
 <div>
  <v-img :aspect-ratio="4/3" class="image ma-0 mb-2 pa-0 text-center" :src="hasImage ? imageUrl : ''" @error="onError">
          <v-layout pa-2 column fill-height class="lightbox white--text" justify-center>
            <v-flex shrink>
              <PlayButton v-if="playable" :item="item" :playerColor="'black'" showMediaPlayer v-on:playStarted="onPlayStarted($event)"/>
            </v-flex>
          </v-layout>
        </v-img>

      <div @click="itemClicked()" ml-2 mr-2 mt-0 pt-0 xs12>
        <div class="itemTitle">{{ item.title }}</div>
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
      </div>
      </div>
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
  methods: {
    onError(e) {
    }
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
