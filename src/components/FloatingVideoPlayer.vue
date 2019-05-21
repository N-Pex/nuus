<template>
  <div
    v-if="item != null && (item.hasVideoAttachment() || item.hasAudioAttachment())"
    :class="{ 'ma-0': true, 'pa-0': true, 'floatingPlayer': true, docked: isDocked }"
    :style="cssProps"
    v-resize="onResize"
  >
    <video
      align-start
      ref="video"
      :class="{ 'videoPlayer': true, docked: isDocked }"
      @click="showHideToolbar"
      @loadeddata="onVideoLoaded"
      @seeked="onVideoSeeked"
      @pause="onVideoPaused"
      @play="onVideoPlay"
      @timeupdate="onVideoTimeUpdate"
    >
      <source :src="enclosureURL" :type="item.enclosureType">Your browser does not support the video tag.
    </video>

    <transition name="fade">
      <div class="toolbar ma-0 pa-0" v-show="showToolbar" :style="overlayStyle">
        <v-container fluid fill-height class="ma-0 pa-0">
          <v-layout
            justify-space-between
            column
            fill-height
            class="ma-0 pa-0"
          >
            <v-flex>
              <v-container fluid>
                <v-layout justify-space-between row>
                  <v-flex xs1>
                    <v-btn
                      flat
                      icon
                      color="white"
                      @click="minimize()"
                      class="ma-2 pa-2"
                      style="min-width: 0"
                    >
                      <v-icon medium class="ma-0 pa-0">expand_more</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs1>
                    <v-btn
                      flat
                      icon
                      color="white"
                      @click="close()"
                      class="ma-2 pa-2"
                      style="min-width: 0"
                    >
                      <v-icon medium>close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>

            <v-flex grow>
              <v-container fluid>
                <v-layout align-center justify-center row wrap>
                  <v-flex xs2 class="text-xs-center">
                    <v-btn flat icon color="white" @click="replay10()" class="ma-2 pa-2">
                      <v-icon medium>replay_10</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-xs-center">
                    <v-btn
                      v-show="!isPlaying"
                      flat
                      large
                      icon
                      color="white"
                      @click="play()"
                      class="ma-2 pa-2"
                    >
                      <v-icon x-large>play_circle_outline</v-icon>
                    </v-btn>
                    <v-btn
                      v-show="isPlaying"
                      flat
                      large
                      icon
                      color="white"
                      @click="pause()"
                      class="ma-2 pa-2"
                    >
                      <v-icon x-large>pause_circle_outline</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-xs-center">
                    <v-btn flat icon color="white" @click="forward10()" class="ma-2 pa-2">
                      <v-icon medium>forward_10</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
            <v-flex style="max-height: 7px">
              <v-progress-linear
                class="ma-0 pa-0"
                background-color="gray"
                color="green lighten-1"
                :value="currentPlayPercentage"
              ></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </transition>
  </div>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import { constants } from "crypto";

export default {
  data: () => ({
    item: null,
    show: true,
    isPlaying: false,
    isDocked: false,
    enclosureURL: "",
    showToolbar: false,
    videoPlayerHeight: 30,
    currentPlayPercentage: 0
  }),
  watch: {
    item: function() {
      if (
        this.item != null &&
        (this.item.hasVideoAttachment() || this.item.hasAudioAttachment())
      ) {
        console.log("Going to play");
        const self = this;
        this.enclosure().then(function(res) {
          self.enclosureURL = res;
          self.$refs.video.pause();
          self.$refs.video.load();
        });
        this.currentPlayPercentage = 0;
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
    },
    overlayStyle() {
      return {
        height: this.videoPlayerHeight + "px"
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

    onResize() {
      if (this.$refs.video != null) {
        let height = this.$refs.video.getBoundingClientRect().height;
        this.videoPlayerHeight = height;
        this.$forceUpdate();
      }
    },

    onVideoLoaded() {
      // Check if we have stored a playhead position for this video
      //
      var url = this.item.enclosure;
      if (localStorage.getItem("playhead:" + url) != null) {
        let time = localStorage.getItem("playhead:" + url);
        this.$refs.video.currentTime = time;
      }

      if ("mediaSession" in navigator) {
        let meta = {
          title: this.item.title,
          artist: this.item.feed.title
        };
        if (this.item.feed.imageUrl != null) {
          console.log("Set artwork to " + this.item.feed.imageUrl);
          meta.artwork = [
            {
              src: this.item.feed.imageUrl
            }
          ];
        }
        navigator.mediaSession.metadata = new MediaMetadata(meta);
      }

      let height = this.$refs.video.getBoundingClientRect().height;
      this.videoPlayerHeight = height;
    },

    onVideoSeeked() {
      // Save the current playhead position for this video (identified by url)
      //
      if (this.item != null && this.item.enclosure != null) {
        var url = this.item.enclosure;
        var time = this.$refs.video.currentTime;
        localStorage.setItem("playhead:" + url, time);
      }
    },
    onVideoPlay() {
      this.isPlaying = true;
    },

    onVideoPaused() {
      this.isPlaying = false;
      this.onVideoSeeked();
    },

    play() {
      this.$refs.video.play();
    },

    pause() {
      this.$refs.video.pause();
    },

    replay10() {
      this.$refs.video.currentTime = Math.max(
        0,
        this.$refs.video.currentTime - 10
      );
    },
    forward10() {
      this.$refs.video.currentTime = Math.min(
        this.$refs.video.duration,
        this.$refs.video.currentTime + 10
      );
    },

    onVideoTimeUpdate() {
      // Update progress bar of current playback. TODO - allow click on progress bar to seek.
      let duration = this.$refs.video.duration;
      let current = this.$refs.video.currentTime;
      this.currentPlayPercentage = (100 * current) / duration;
    },

    minimize() {
      this.isDocked = !this.isDocked;
      this.$emit("minimize");
    },

    close() {
      this.item = null;
      this.$emit("close");
    },

    showHideToolbar() {
      this.showToolbar = !this.showToolbar;
      if (this.showToolbar) {
        setTimeout(this.showHideToolbar, 3000);
      }
    }
  }
};
</script>

<style>
.floatingPlayer {
  display: table-row;
  width: 100%;
  height: auto;
  background-color: argb(#aaa, 0);
  z-index: 900;
  transition: 0.5s;
}

.floatingPlayer.docked {
  display: table-row;
  position: fixed;
  background-color: #aaa;
  top: calc(100vh - 102px);
  left: 2px;
  width: calc(100vw - 4px);
  height: 100px;
}

.toolbar {
  top: 0;
  right: 0;
  left: 0;
  position: absolute;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>