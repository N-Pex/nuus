<template>
  <div :class="{ 'videoPlayerRoot': true, docked: isDocked }">
    <v-container fill-height fluid ma-0 pa-0>
      <v-layout fill-height align-center row ma-0 pa-0>
        <v-flex fill-height ma-0 pa-0 :class="'xs'+ (isDocked ? 3 : 12)" style="display: grid">
          <div style="grid-column: 1; grid-row: 1">
            <!-- VIDEO PLAYER -->
            <video
              class="videoPlayer"
              ref="video"
              @click="showHideOverlayControls"
              @loadeddata="onVideoLoaded"
              @seeked="onVideoSeeked"
              @pause="onVideoPaused"
              @play="onVideoPlay"
              @timeupdate="onVideoTimeUpdate"
            >
              <source :src="enclosureURL" :type="enclosureType">Your browser does not support the video tag.
            </video>
          </div>
          <transition name="fade">
            <div
              class="overlayControls"
              style="grid-column: 1; grid-row: 1"
              v-show="showOverlayControls"
            >
              <!-- TOP PART - MINIMIZE AND CLOSE BUTTONS -->
              <v-btn
                flat
                icon
                color="white"
                @click="minimize()"
                class="ma-2 pa-2"
                style="position: absolute; left: 0; top: 0"
              >
                <v-icon medium class="ma-0 pa-0">expand_more</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                color="white"
                @click="close()"
                class="ma-2 pa-2"
                style="position: absolute; right: 0; top: 0"
              >
                <v-icon medium>close</v-icon>
              </v-btn>

              <!-- MIDDLE PART - REPLAY, PLAY AND SKIP -->
              <v-container fluid fill-height pa-0 ma-0>
                <v-layout align-center justify-center row pa-0 ma-0>
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

              <!-- BOTTOM PART - PROGRESS -->
              <v-progress-linear
                style="max-height: 7px; position: absolute; bottom: 0; left: 0; right: 0"
                class="ma-0 pa-0"
                background-color="gray"
                color="green lighten-1"
                :value="currentPlayPercentage"
              ></v-progress-linear>
            </div>
          </transition>
        </v-flex>
        <v-flex xs7 v-show="isDocked" @click="maximize()" class="text-xs-center">
          <v-btn
            class="ma-0 pa-0"
            flat
            small
            color="black"
            @click="maximize()"
            style="min-width: 0;min-height: 0"
          >
            <v-icon small>expand_less</v-icon>
          </v-btn>
          <div class="dockedTitle">{{ item.title }}</div>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-xs-center">
          <v-btn v-show="!isPlaying" flat medium color="black" @click="play()">
            <v-icon>play_circle_outline</v-icon>
          </v-btn>
          <v-btn v-show="isPlaying" flat medium color="black" @click="pause()">
            <v-icon>pause_circle_outline</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-xs-center">
          <v-btn flat medium color="black" @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import { constants } from "crypto";

export default {
  data: () => ({
    item: new ItemModel(),
    isPlaying: false,
    isDocked: true,
    enclosureURL: "",
    enclosureType: null,
    showOverlayControls: false,
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
          self.enclosureType = self.item.enclosureType;
          self.$refs.video.pause();
          self.$refs.video.load();
        });
        this.currentPlayPercentage = 0;
        this.isDocked = false;
      }
    }
  },
  computed: {},
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
      var url = this.item.enclosure;
      if (localStorage.getItem("playhead:" + url) != null) {
        let time = localStorage.getItem("playhead:" + url);
        this.$refs.video.currentTime = time;
      }

      if ("mediaSession" in navigator && this.item != null) {
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
      this.showOverlayControls = false;
      this.isDocked = true;
      this.$emit("minimize");
    },

    maximize() {
      this.isDocked = false;
      this.$emit("maximize");
    },

    close() {
      this.$refs.video.pause();
      this.$emit("close");
    },

    showHideOverlayControls() {
      if (this.isDocked) {
        this.showOverlayControls = false;
      } else {
        this.showOverlayControls = !this.showOverlayControls;
        if (this.showOverlayControls) {
          setTimeout(this.showHideOverlayControls, 3000);
        }
      }
    }
  }
};
</script>

<style scoped>
.videoPlayerRoot {
  position: fixed;
  left: 0;
  top: 56px;
  right: 0;
  bottom: 66%;
  background-color: #000;
  z-index: 2;
  transition: 0.3s;
}

.docked {
  position: fixed;
  background-color: #aaa;
  top: calc(100vh - 70px);
  left: 0px;
  width: calc(100vw - 0px);
  height: 70px;
  border: 1px solid gray;
}

.videoPlayer {
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: auto;
  max-height: 100%;
}

.docked .videoPlayer {
  height: 100%;
  width: auto;
}

.overlayControls {
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.v-btn {
  min-width: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>