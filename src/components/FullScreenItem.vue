<template>
  <v-container fluid ma-0 pa-0 v-scroll:#scroll-target="onScroll">
    <v-layout>
      <v-flex xs12>
        <v-toolbar flat fixed class="black--text toolbar" :style="cssProps">
          <v-toolbar-side-icon @click="onClose()" class="toolbarIcon" :style="cssProps">
            <v-icon>arrow_back</v-icon>
          </v-toolbar-side-icon>

          <div v-if="item != null && item.hasAudioAttachment()" class="toolbarObject">
            <v-btn
              v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer.item == item && this.$root.mediaPlayer.isPlaying"
              flat
              icon
              :color="playerColor"
              @click="pause()"
              class="ma-2 pa-0 small-button"
            >
              <v-icon>$vuetify.icons.pause</v-icon>
            </v-btn>
            <v-btn
              v-show="this.$root.mediaPlayer == null || this.$root.mediaPlayer.item != item || !this.$root.mediaPlayer.isPlaying"
              flat
              icon
              :color="playerColor"
              @click="play()"
              class="ma-2 pa-0 small-button"
            >
              <v-icon>$vuetify.icons.play</v-icon>
            </v-btn>
          </div>

          <v-toolbar-title class="toolbarObject">{{ item.title }}</v-toolbar-title>
        </v-toolbar>
        <v-card color="white" flat :style="cssProps">
          <v-img v-if="imageUrl != null" class="white--text" height="200px" :src="imageUrl"/>
          <Share class="share" :item="item"/>

          <v-slider
            v-if="item != null && item.hasAudioAttachment()"
            v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer.item == item"
            height="4px"
            color="green lighten-1"
            class="progress ma-0 pa-0"
            background-color="gray"
            :value="currentPlayPercentage"
            v-on:change="onSeek($event)"
            v-on:start="draggingSlider = true"
            v-on:end="draggingSlider = false"
          />

          <v-container :class="{'noImage': this.imageUrl == null}">
            <div v-html="item.description" class="body"/>
            <div v-html="item.content" class="content"/>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import Share from "../components/Share";
import Vuetify from "vuetify";
import ItemModel from "../models/itemmodel";
import OneButtonAudioPlayer from "../components/OneButtonAudioPlayer";

export default {
  name: "FullScreenItem",
  components: {
    Share,
    OneButtonAudioPlayer
  },
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },
  data: () => ({
    moveFraction: 1,
    fadeFraction: 0,
    imageUrl: null,
    draggingSlider: false,
    currentPlayPercentage: 0
  }),

  mounted: function() {
    this.imageUrl = this.item.imageSrc;
    if (this.imageUrl == null) {
      this.moveFraction = 0;
      this.fadeFraction = 0;
    } else {
      this.moveFraction = 1;
      this.fadeFraction = 1;
    }
    this.$root.$on(
      "currentPlayPercentage",
      function(event) {
        // Called when audio player playback percentage changes. Use this to update our progress bar.
        if (!this.draggingSlider) {
          this.currentPlayPercentage = event.currentPlayPercentage;
        }
      }.bind(this)
    );
  },
  computed: {
    cssProps() {
      return {
        "--v-move-fraction": this.moveFraction,
        "--v-fade-fraction": this.fadeFraction
      };
    },
    playerColor() {
      return this.fullColorHex(
        255 * this.moveFraction,
        255 * this.moveFraction,
        255 * this.moveFraction
      );
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onScroll(e) {
      if (this.imageUrl != null) {
        let offsetTop = e.target.scrollTop;
        this.moveFraction = Math.min(1, Math.max(0, 1 - offsetTop / 150));
        if (this.moveFraction < 0.2) {
          this.fadeFraction = this.moveFraction / 0.2;
        } else {
          this.fadeFraction = 1;
        }
      }
    },

    onSeek(percentage) {
      let audioPlayer = this.$root.mediaPlayer;
      if (audioPlayer != null) {
        audioPlayer.seekToPercentage(percentage);
      }
    },

    // From https://campushippo.com/lessons/how-to-convert-rgb-colors-to-hexadecimal-with-javascript-78219fdb
    //
    rgbToHex(rgb) {
      var hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }
      return hex;
    },

    fullColorHex(r, g, b) {
      var red = this.rgbToHex(r);
      var green = this.rgbToHex(g);
      var blue = this.rgbToHex(b);
      return "#" + red + green + blue;
    },

    pause() {
      this.$root.mediaPlayer.pause();
    },

    play() {
      if (
        this.$root.mediaPlayer == null ||
        this.$root.mediaPlayer.item != this.item
      ) {
        // Open audio player in minimized mode
        if (this.$root.mediaPlayer != null) {
          this.$root.mediaPlayer.item = null;
        }
      }
      this.$root.mediaPlayer = this.$root.audioPlayer;
      this.$root.mediaPlayerDocked = true;
      this.$root.mediaPlayerInvisible = true;
      let mediaPlayer = this.$root.mediaPlayer;
      if (mediaPlayer.item == this.item) {
        mediaPlayer.play();
      } else {
        mediaPlayer.load(this.item, true);
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  height: 50px;
  background-color: rgba(255, 255, 255, calc(1 - var(--v-fade-fraction)));
}

.toolbarIcon {
  color: rgba(
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    1
  );
}

.toolbarObject {
  position: relative;
  left: calc(-40px * var(--v-move-fraction));
  top: calc(150px * var(--v-move-fraction));
  color: rgba(
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    1
  );
}

.share {
  width: 100%;
  height: 50px;
  position: sticky;
  top: 50px;
}

.progress {
  position: sticky;
  top: 100px;
}

.noImage {
  /* Prevent the content from disappearing under toolbar and share bar! */
  padding-top: 100px;
}
</style>