<template>
    <div class="videoItemList">
      <!-- Video player, current item info (including share) and a list of videos -->
      <VideoPlayer
        ref="videoPlayer"
        :isDocked="this.$root.mediaPlayerDocked"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer == this.$refs.videoPlayer && !this.$root.mediaPlayerInvisible"
      />

      <v-container
        class="videoListCurrentItem"
        fluid
        grid-list-sm
        pa-0
        ma-0
        v-if="showMediaList && playingMediaItem != null && playingMediaItem.hasVideoAttachment()"
      >
        <v-layout xs12>
          <v-flex
            xs12
            ml-2
            mr-2
            mt-0
            pt-0
          >
            <div>
              <Date class="itemDate verticalCenter" :date="playingMediaItem.pubDate"/>
            </div>
            <div
              class="mediaItemTitle"
              style="max-height:var(--v-theme-media-title-line-height-scaled-x2);overflow:hidden"
            >{{ playingMediaItem.title }}</div>
            <div class="contentBlock mt-2">
              <div
                v-html="playingMediaItem.description"
                class="mediaItemBody"
                style="max-height:var(--v-theme-media-body-line-height-scaled-x2);overflow:hidden"
              />
            </div>
            <Share :item="playingMediaItem" />
          </v-flex>
        </v-layout>
      </v-container>
      <ItemList
        listType="video"
        :items="items | videoItems"
        v-if="showMediaList && playingMediaItem != null && playingMediaItem.hasVideoAttachment()"
        :selectedItem="playingMediaItem"
        v-on:playItem="playItemFromMediaList($event)"
        v-on:itemClicked="playItemFromMediaList($event)"
        class="videoList"
      />
    </div>
  </v-card>
</template>

<script>
import ItemList from "../components/ItemList";
import Item from "../components/Item";
import ItemModel from "../models/itemmodel";
import VideoPlayer from "../components/VideoPlayer";
import Share from "../components/Share";
import Date from "../components/Date";
/*
import axios from "axios";
import sanitizeHTML from "sanitize-html";
import db from "../database";
import rssparser from "../services/rssparser";
import velocity from "velocity-animate";
import flavors from "../config";
import router from "../router";
*/

export default {
  name: "VideoView",
  components: {
//    UrlInput,
    ItemList,
    Item,
    VideoPlayer,
//    AudioPlayer,
    Share,
//    FullScreenItem,
    Date
  },
  props: {
    items: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  methods: {
    itemClicked(eventInfo) {
      console.log(
        "Item clicked " + eventInfo.item.title + " at rect " + eventInfo.rect
      );
      this.$router.push("/item/1");
    },

    setMediaPlayer(mediaPlayer) {
      if (this.$root.mediaPlayer != null) {
        this.$root.mediaPlayer.item = null;
      }
      console.log(mediaPlayer);
      this.$root.mediaPlayer = mediaPlayer;
      this.$root.mediaPlayerInvisible = false;
    },

    playItem(eventInfo) {
      console.log("Play item " + eventInfo.item.title);
      if (eventInfo.item.hasVideoAttachment()) {
        this.$root.mediaPlayerDocked = false;
        this.setMediaPlayer(this.$refs.videoPlayer);
        this.showMediaList = true;
      } else {
        // Audio player. Start docked (so dont show the media list).
        this.$root.mediaPlayerDocked = true;
        this.setMediaPlayer(this.$refs.audioPlayer);
        this.showMediaList = false;
      }
      this.$root.mediaPlayerHidden = false;
      this.$root.mediaPlayer.load(eventInfo.item, true);
      this.playingMediaItem = eventInfo.item;
    },

    playItemFromMediaList(eventInfo) {
      this.$root.mediaPlayer.load(eventInfo.item, true);
      this.playingMediaItem = eventInfo.item;
    },

    onClose() {
      this.showMediaList = false;
      this.setMediaPlayer(null);
    },

    onMinimize() {
      this.$root.mediaPlayerDocked = true;
      this.showMediaList = false;
    },

    onMaximize() {
      this.$root.mediaPlayerDocked = false;
      if (this.$root.mediaPlayer != null) {
        this.showMediaList = true;
      }
    },
  },

  data() {
    return {
      showMediaList: false,
      playingMediaItem: null
    };
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
@import url("../assets/shared-styles.css");
</style>

<style>

.videoListCurrentItem {
  background-color: #ffffff;
  position: absolute;
  top: 25%;
  bottom: 60%;
  right: 0;
  left: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}

.videoList {
  background-color: #ffffff;
  position: absolute;
  top: 40%;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>