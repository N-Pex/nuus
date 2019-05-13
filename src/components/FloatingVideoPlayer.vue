<template>
  <v-container align-start v-if="item != null && item.hasVideoEnclosure()" :class="{ 'ma-0': true, 'pa-0': true, 'floatingPlayer': true, docked: isDocked }" :style="cssProps">
    <v-layout justify-end class="toolbar">
      <v-btn flat icon color="white" @click="dock()" class="ma-0 pa-0" style="min-width: 0">
        <v-icon small class="ma-0 pa-0">minimize</v-icon>
      </v-btn>
      <v-btn flat icon color="white" @click="close()" class="ma-0 pa-0" style="min-width: 0">
        <v-icon small>close</v-icon>
      </v-btn>
    </v-layout>

    <video align-start ref="video" controls :class="{ 'videoPlayer': true, docked: isDocked }" 
      @loadeddata="onVideoLoaded"
      @seeked="onVideoSeeked"
      @pause="onVideoPaused"
      >
      <source :src="enclosureURL" :type="item.enclosureType">Your browser does not support the video tag.
    </video>
  </v-container >
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import { constants } from "crypto";

export default {
  data: () => ({
    item: null,
    show: true,
    isDocked: false,
    enclosureURL: ""
  }),
  watch: {
    item: function() {
      if (this.item != null && this.item.hasVideoEnclosure()) {
          const self = this;
          this.enclosure().then(function(res) {
            self.enclosureURL = res;
            self.$refs.video.pause();
            self.$refs.video.load();
          });
          this.isDocked = false;
          this.show = true;
        } else {
          this.show = false;
        }
    }
  },
  computed: {
    cssProps() {
      return {
        visibility: this.show ? "visible" : "hidden"
      };
    }
  },
  methods: {
    async enclosure() {
      if (this.item.enclosure.startsWith("file://")) {
        let blob = await db.getMediaFile(this.item.enclosure);
        var myURL = window.URL || window.webkitURL;
        let url = myURL.createObjectURL(blob.blob);
        return url;
      }
      return this.item.enclosure;
    },
        
    onVideoLoaded() {
      // Check if we have stored a playhead position for this video
      //
      if (localStorage.getItem("playhead:" + url) != null) {
        let time = localStorage.getItem("playhead:" + url);
        this.$refs.video.currentTime = time;
      }
    },

    onVideoSeeked() {
      // Save the current playhead position for this video (identified by url)
      //
      var url = this.item.enclosure;
      var time = this.$refs.video.currentTime;
      localStorage.setItem("playhead:" + url, time);
    },

    onVideoPaused() {
      this.onVideoSeeked();
    },

    dock() {
      this.isDocked = !this.isDocked;
    },
    close() {
      this.item = null;
    }
  }
};
</script>

<style>
.floatingPlayer {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 30%;
  height: 30%;
  background-color: argb(#aaa, 0);
  z-index: 900;
  transition: 0.5s;
}

.floatingPlayer.docked {
  background-color: #aaa;
  top: calc(100vh - 120px);
  left: 10px;
  width: 100%;
  height: 100px;
}

.toolbar {
  background-color: #666;
  height: 30px;
}

.videoPlayer {
  width: 100%;
  height: auto;
  overflow: hidden;
  transition: 0.5s;
  padding-left: 0px;
}

.videoPlayer.docked {
  width: auto;
  height: 60px;
  padding-left: 10px;
}

</style>