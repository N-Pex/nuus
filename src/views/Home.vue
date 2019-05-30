<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>NUUS</span>
        <span class="font-weight-light">RSS READER</span>
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

        <v-list-tile>
          <v-list-tile-content>
              <UrlInput v-on:update:url="urlUpdated($event)" v-bind:url="url"/>
          </v-list-tile-content>
        </v-list-tile>

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
      />
      <VideoPlayer
        ref="videoPlayer"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-show="showMediaPlayer"
      />
      <div v-if="showItemFullscreen" class="nextUpVideoList">
        <Share style="width: 100%; height: 60px" />
        This space for rent.
      </div>

      <div v-if="showItemFullscreen" class="fullScreenItem" id="scroll-target">
        <FullScreenItem v-on:close="onCloseFullscreen()"/>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import UrlInput from "../components/UrlInput";
import ItemList from "../components/ItemList";
import Item from "../components/Item";
import VideoPlayer from "../components/VideoPlayer";
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
    Share,
    FullScreenItem
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.left = this.itemRect.x + "px";
      el.style.top = this.itemRect.y + "px";
      el.style.width = this.itemRect.width + "px";
      el.style.height = this.itemRect.height + "px";
    },
    enter: function(el, done) {
      Velocity(
        el,
        {
          opacity: 1,
          left: "0px",
          top: "0px",
          width: "100%",
          height: "100%"
        },
        { duration: 600, complete: done }
      );
    },
    leave: function(el, done) {
      Velocity(
        el,
        {
          opacity: 0,
          left: this.itemRect.x + "px",
          top: this.itemRect.y + "px",
          width: this.itemRect.width + "px",
          height: this.itemRect.height + "px"
        },
        { duration: 600, complete: done }
      );
    },
    urlUpdated(url) {
      this.url = url;
      const self = this;
      rssparser.fetchUrl(url, function(items) {
        self.items = items;
      });
    },
    itemClicked(eventInfo) {
      console.log(
        "Item clicked " + eventInfo.item.title + " at rect " + eventInfo.rect
      );
      this.itemFullscreen = eventInfo.item;
      this.itemRect = eventInfo.rect;
      // this.showItemFullscreen = true;
      this.$refs.videoPlayer.item = eventInfo.item;
    },

    playItem(eventInfo) {
      console.log("Play item " + eventInfo.item.title);
      this.$refs.videoPlayer.item = eventInfo.item;
      this.showItemFullscreen = true;
      this.showMediaPlayer = true;
    },

    itemCloseClicked(eventInfo) {
      this.showItemFullscreen = false;
    },

    onCloseFullscreen() {
      this.showItemFullscreen = false;
      this.showMediaPlayer = false;
    },

    onClose() {
      this.showItemFullscreen = false;
      this.showMediaPlayer = false;
    },

    onMinimize() {
      this.showItemFullscreen = false;
    },

    onMaximize() {
      this.showItemFullscreen = true;
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

    console.log("Loading web font " + flavor.themeBodyFont);
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
      showMediaPlayer: false,
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
        .classList.toggle("application--dialog-opened", isOpen);
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
    }
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
</style>

<style>
.application--dialog-opened {
  overflow: hidden;
}

.nextUpVideoList {
  background-color: lightgray;
  position: fixed;
  top: 33%;
  bottom: 0;
  right: 0;
  left: 0;
}

.fullScreenItem {
  background-color: yellowgreen;
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