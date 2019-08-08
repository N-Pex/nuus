<template>
  <div v-if="item != null && item.hasAudioAttachment()">
    <v-btn
      v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer.item == item && this.$root.mediaPlayer.isPlaying"
      text
      icon
      :color="playerColor"
      @click="pause()"
      class="ma-0 pa-0 small-button"
    >
      <v-icon>$vuetify.icons.pause</v-icon>
    </v-btn>
    <v-btn
      v-show="this.$root.mediaPlayer == null || this.$root.mediaPlayer.item != item || !this.$root.mediaPlayer.isPlaying"
      text
      icon
      :color="playerColor"
      @click="play()"
      class="ma-0 pa-0 small-button"
    >
      <v-icon>$vuetify.icons.play</v-icon>
    </v-btn>
  </div>
</template>


<script>
import ItemModel from "../models/itemmodel";

export default {
  name: "PlayButton",
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    },
    playerColor: {
      type: String,
      default: function() {
        return "#000000";
      }
    }
  },

  mounted: function() {
    // If we are playing this item, hide the docked media player since we already
    // show the play/pause button next to the title.
    if (
      this.$root.mediaPlayer != null &&
      this.$root.mediaPlayer.item == this.item
    ) {
      this.$root.mediaPlayerInvisible = true;
    }
  },
  methods: {
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

<style>
</style>

