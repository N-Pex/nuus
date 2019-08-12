<template>
  <v-container fluid ma-0 pa-0 v-scroll:#scroll-target="onScroll">
    <v-layout>
      <v-flex xs12>
        <v-app-bar flat fixed class="black--text toolbar" :style="cssProps">
          <v-app-bar-nav-icon @click="onClose()" :style="cssProps">
            <v-icon :color="iconColor">arrow_back</v-icon>
          </v-app-bar-nav-icon>
          <PlayButton v-if="item != null && item.hasAudioAttachment()" :item="item" :playerColor="playerColor" />
          <v-toolbar-title class="toolbarTitle">{{ item.title }}</v-toolbar-title>
        </v-app-bar>
        <v-card color="white" flat :style="cssProps">
          <div style="height: 200px; display: grid" v-if="imageUrl != null">
            <v-img
              class="white--text"
              :src="imageUrl"
              gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,1)"
              style="grid-column: 1; grid-row: 1"
            />
            <div
              style="grid-column: 1; grid-row: 1; align-self: end; z-index: 80"
            >
              <v-container fluid class="itemImageTitle ma-4">
              <v-layout align-start>
                <v-flex xs1 v-if="playableItem">
                  <PlayButton :item="item" :playerColor="imageTitlePlayerColor" />
                </v-flex>
                <v-flex :class="{ 'xs11': playableItem, 'xs12': !playableItem }">
                  <div class="itemTitle ma-2">{{ item.title }}</div>
                </v-flex>
              </v-layout>
              </v-container>
            </div>
          </div>

          <Share class="share" :item="item" />

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
            <div v-html="item.description" class="itemDescription mb-4" />
            <div v-html="item.content" class="itemBody" />
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
import PlayButton from "../components/PlayButton";

export default {
  name: "FullScreenItem",
  components: {
    Share,
    PlayButton
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
    // If we are playing this item, hide the docked media player since we already
    // show the play/pause button next to the title.
    if (
      this.$root.mediaPlayer != null &&
      this.$root.mediaPlayer.item == this.item
    ) {
      this.$root.mediaPlayerInvisible = true;
    }

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
    iconColor() {
      return "rgba(calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),1)";
    },
    playerColor() {
      return "rgba(calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),calc(1 - var(--v-fade-fraction)))";
    },
    imageTitlePlayerColor() {
      return "rgba(255, 255, 255, var(--v-fade-fraction))";
    },
    playableItem() {
      return this.item != null && this.item.hasAudioAttachment();
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onScroll(e) {
      if (this.imageUrl != null) {
        let offsetTop = e.target.scrollTop;
        this.moveFraction = Math.min(
          1,
          Math.max(0, 1 - offsetTop / 150)
        ).toFixed(2);
        if (this.moveFraction < 0.2) {
          this.fadeFraction = (this.moveFraction / 0.2).toFixed(2);
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

.toolbarTitle {
  position: relative;
  color: rgba(
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    calc(1 - var(--v-fade-fraction))
  );
}

.itemImageTitle {
  position: relative;
  font-size: var(--v-theme-title-font-size-scaled);
  left: calc(40px * (1 - var(--v-move-fraction)));
  color: rgba(
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    calc(255 * var(--v-fade-fraction)),
    var(--v-fade-fraction)
  );
}

.share {
  background-color: white;
  width: 100%;
  height: 60px;
  position: sticky;
  top: 60px;
}

.progress {
  position: sticky;
  top: 110px;
}

.noImage {
  /* Prevent the content from disappearing under toolbar and share bar! */
  padding-top: 110px;
}
</style>

<style>
div.image-inline,
div.image-inline div {
  display: inline;
}
div.itemBody img {
  width: 120px !important;
  height: 120px !important;
}
.image-inline:nth-of-type(odd) img {
  float: left !important;
  margin-right: 10px;
}
.image-inline:nth-of-type(even) img {
  float: right !important;
  margin-left: 10px;
}
</style>
