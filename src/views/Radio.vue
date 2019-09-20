<template>
  <div class="mainRoot" :style="cssProps">
    <v-app-bar flat absolute class="transparentAppBar">
      <v-app-bar-nav-icon>
        <v-icon color="#1B9739">$vuetify.icons.logo</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title :class="{'feedTitle': true, 'text-uppercase': true}">{{ $store.state.currentFeedTitle }}</v-toolbar-title>
    </v-app-bar>

    <div class="audioItemList">
      <AudioPlayer
        ref="audioPlayer"
        :isDocked="false"
        :showCloseMinimizeButtons="false"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-on:openFullscreen="itemClicked($event)"
      />

      <ItemListAudio
        :items="filteredItems | audioItems"
        :selectedItem="playingMediaItem"
        v-on:playItem="playItemFromMediaList($event)"
        v-on:itemClicked="playItemFromMediaList($event)"
        class="audioList"
      />
    </div>
  </div>
</template>

<script>
import Home from "./Home";
import ItemList from "../components/ItemList";
import ItemListPlain from "../components/ItemListPlain";
import ItemListAudio from "../components/ItemListAudio";
import ItemListVideo from "../components/ItemListVideo";
import Item from "../components/Item";
import ItemModel from "../models/itemmodel";
import VideoPlayer from "../components/VideoPlayer";
import AudioPlayer from "../components/AudioPlayer";
import Share from "../components/Share";
import FullScreenItem from "../components/FullScreenItem";
import DateView from "../components/DateView";

//import axios from "axios";
//import sanitizeHTML from "sanitize-html";
import db from "../database";
//import rssparser from "../services/rssparser";
//import velocity from "velocity-animate";
import flavors from "../config";
import router from "../router";
import moment from "moment";

export default {
  name: "Radio",
  extends: Home,
  components: {
    //ItemList,
    //ItemListPlain,
    ItemListAudio,
    //ItemListVideo,
    Item,
    //VideoPlayer,
    AudioPlayer,
    Share,
    //FullScreenItem,
    DateView
  },
  methods: {
  },

  destroyed() {
  },

  mounted() {
    this.$root.mediaPlayerDocked = true;
    this.setMediaPlayer(this.$refs.audioPlayer);
    this.$root.mediaPlayerHidden = false;
  },


};
</script>

<style scoped>
@import url("../assets/css/item-style.css");
@import url("../assets/css/shared-styles.css");
</style>
