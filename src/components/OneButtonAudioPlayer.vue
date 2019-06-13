<template>
  <div>
    <audio
      class="player"
      ref="player"
      @canplay="onCanPlay"
      @loadeddata="onLoaded"
      @seeked="onSeeked"
      @pause="onPaused"
      @play="onPlay"
      @timeupdate="onTimeUpdate"
    >
      <source :src="enclosureURL" :type="enclosureType">Your browser does not support the audio tag.
    </audio>
    <v-btn
      v-show="!isPlaying"
      flat
      icon
      :color="color"
      @click="play()"
      class="ma-2 pa-0 small-button"
    >
      <v-icon>$vuetify.icons.play</v-icon>
    </v-btn>
    <v-btn
      v-show="isPlaying"
      flat
      icon
      :color="color"
      @click="pause()"
      class="ma-2 pa-0 small-button"
    >
      <v-icon>$vuetify.icons.pause</v-icon>
    </v-btn>
  </div>
</template>


<script>
import MediaPlayerBase from "./MediaPlayerBase.vue";

export default {
  extends: MediaPlayerBase,
  props: {
    color: {
      type: String,
      default: function() {
        return "#000000";
      }
    }}
};
</script>



