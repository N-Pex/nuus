<template>
  <v-app>
    <v-toolbar app flat color="rgba(0,0,0,0.05)">
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon>$vuetify.icons.logo</v-icon>
      </v-toolbar-side-icon>
      <v-spacer />
      <v-toolbar-title class="headline text-uppercase">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position:fixed; top:0; left:0; overflow-y:scroll;"
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="img/icons/apple-touch-icon-60x60.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>NUUS</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in menuItems" :key="item.title" @click>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click>
          <v-list-tile-action>
            <v-checkbox v-model="$root.showMedia"></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-content @click="$root.showMedia = !$root.showMedia">
            <v-list-tile-title>Show media</v-list-tile-title>
            <v-list-tile-sub-title>Show images, video and audio</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-content>
            <v-slider v-model="textSizeAdjustment" prepend-icon="text_fields" min="-6" max="6"/>
          </v-list-tile-content>
        </v-list-tile>

              <UrlInput v-on:update:url="urlUpdated($event)" v-bind:url="url"/>

        <v-list-tile>
          <v-list-tile-content>
            <v-btn @click="showOnboarding()">Show onboarding</v-btn>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-content>
      <ItemList
        v-bind:items="items"
        v-on:itemClicked="itemClicked($event)"
        v-on:playItem="playItem($event)"
        class="pt-3 mainItemList"
      />
      <VideoPlayer
        ref="videoPlayer"
        :isDocked="mediaPlayerDocked"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-show="showVideoPlayer"
      />
      <AudioPlayer
        ref="audioPlayer"
        :isDocked="mediaPlayerDocked"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-show="showAudioPlayer"
      />

      <ItemList ref="mediaList" isMediaList :items="mediaItems" v-show="showMediaList" :selectedItem="playingMediaItem" 
        v-on:itemClicked="playItem($event)"
        class="nextUpVideoList" />

      <div v-if="showItemFullscreen" class="fullScreenItem" id="scroll-target">
        <FullScreenItem v-on:close="onCloseFullscreen()" :item="itemFullscreen"/>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import UrlInput from "../components/UrlInput";
import ItemList from "../components/ItemList";
import Item from "../components/Item";
import ItemModel from "../models/itemmodel";
import VideoPlayer from "../components/VideoPlayer";
import AudioPlayer from "../components/AudioPlayer";
import Share from "../components/Share";
import FullScreenItem from "../components/FullScreenItem";

import axios from "axios";
import sanitizeHTML from "sanitize-html";
import db from "../database";
import rssparser from "../services/rssparser";
import velocity from "velocity-animate";
import flavors from "../config";
import router from '../router'

export default {
  name: "Home",
  components: {
    UrlInput,
    ItemList,
    Item,
    VideoPlayer,
    AudioPlayer,
    Share,
    FullScreenItem
  },
  methods: {
    urlUpdated(url) {
      this.url = url;
      const self = this;
      rssparser.fetchUrl(url, function(feed, items) {
        self.title = feed.title;
        self.items = items;
      });
    },
    itemClicked(eventInfo) {
      console.log(
        "Item clicked " + eventInfo.item.title + " at rect " + eventInfo.rect
      );
      this.itemFullscreen = eventInfo.item;
      this.itemRect = eventInfo.rect;
      this.showItemFullscreen = true;
      //this.$refs.videoPlayer.item = eventInfo.item;
    },

    playItem(eventInfo) {
      console.log("Play item " + eventInfo.item.title);
      this.itemFullscreen = eventInfo.item;
      if (eventInfo.item.hasVideoAttachment()) {
        this.mediaPlayerDocked = false;
        this.$refs.videoPlayer.item = eventInfo.item;
        this.showVideoPlayer = true;
        this.$refs.audioPlayer.item = null;
        this.showAudioPlayer = false;
        this.showMediaList = true;
      } else {
        // Audio player. Start docked (so dont show the media list).
        this.mediaPlayerDocked = true;
        this.$refs.videoPlayer.item = null;
        this.showVideoPlayer = false;
        this.$refs.audioPlayer.item = eventInfo.item;
        this.showAudioPlayer = true;
        this.showMediaList = false;
      }
      this.playingMediaItem = eventInfo.item;
      // let element = this.$refs.mediaList.$refs['item-' + this.playingMediaItem.guid];
      // console.log("--------------");
      // console.log(element);
      // element.scrollIntoView(true);
    },

    itemCloseClicked(eventInfo) {
      this.showItemFullscreen = false;
    },

    onCloseFullscreen() {
      this.showItemFullscreen = false;
      this.showAudioPlayer = false;
      this.showVideoPlayer = false;
    },

    onClose() {
      this.showMediaList = false;
      this.showAudioPlayer = false;
      this.showVideoPlayer = false;
    },

    onMinimize() {
      this.mediaPlayerDocked = true;
      this.showMediaList = false;
    },

    onMaximize() {
      this.mediaPlayerDocked = false;
      if (this.showAudioPlayer || this.showVideoPlayer) {
        this.showMediaList = true;
      }
    },

    showOnboarding() {
      router.push({ name: "onboarding" });
    }
  },

  mounted() {
    let flavor = flavors[this.$store.state.flavor];

    // Set RTL from config
    this.$vuetify.rtl = flavor.isRTL;

    // Insert link to font style sheet so the web font loader will find the fonts.
    let file = document.createElement("link");
    file.rel = "stylesheet";
    file.type = "text/css";
    file.href = flavor.webFontCssFile;
    document.head.appendChild(file);

    var WebFont = require("webfontloader");
    WebFont.load(flavor.webFontConfig);

    this.urlUpdated("./assets/nasa.xml");
  },

  data() {
    return {
      url: "Please enter a URL",
      items: [],
      drawer: null,
      itemRect: new DOMRect(0, 0, 0, 0),
      itemFullscreen: null,
      showItemFullscreen: false,
      showVideoPlayer: false,
      showAudioPlayer: false,
      showMediaList: false,
      mediaPlayerDocked: false,
      playingMediaItem: null,
      title: "",
      menuItems: [
        /*
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
        */
      ]
      //
    };
  },
  watch: {
    showItemFullscreen: function(isOpen) {
      document
        .querySelector("html")
        .classList.toggle("application--dialog-opened", this.showItemFullscreen || this.showMediaList);
    },
    showMediaList: function(isOpen) {
      document
        .querySelector("html")
        .classList.toggle("application--dialog-opened", this.showItemFullscreen || this.showMediaList);
    }

  },
  computed: {
    textSizeAdjustment: {
      get: function() {
        return this.$store.state.textSizeAdjustment;
      },
      set: function(val) {
        this.$store.commit("setTextSizeAdjustment", val);
      }
    },
    mediaItems: function() {
      const self = this;
      //console.log("ITEM is " + this.itemFullscreen);
       return this.items.filter(function(i) {
         if (self.itemFullscreen != null) {
            //console.log("Has item");
           if (self.itemFullscreen.hasVideoAttachment()) {
             // Current item is a video. Only show video items in the media list!
             return i.hasVideoAttachment();
           } else if (self.itemFullscreen.hasAudioAttachment()) {
             return i.hasAudioAttachment();
           }
         }
         return false
     })
   }
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
@import url("../assets/shared-styles.css");
</style>

<style>
.application--dialog-opened {
  overflow: hidden;
}

.mainItemList {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-top: 100px !important;
}

.nextUpVideoList {
  background-color: #fff;
  position: fixed;
  top: 33%;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y:scroll;
  overflow-x:hidden;
}

.fullScreenItem {
  background-color: rgb(245, 248, 239);
  z-index: 3;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}


</style>