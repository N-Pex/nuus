<template>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import { constants } from "crypto";

export default {
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    },
    isDocked: false
  },
  data: () => ({
    itemTitle: "",
    isPlaying: false,
    enclosureURL: "",
    enclosureType: null,
    currentPlayPercentage: 0,
    showOverlayControls: false
  }),
  watch: {
    item: function() {
      if (
        this.item != null &&
        (this.item.hasVideoAttachment() || this.item.hasAudioAttachment())
      ) {
        this.itemTitle = this.item.title;
        const self = this;
        this.enclosure().then(function(res) {
          self.enclosureURL = res;
          self.enclosureType = self.item.enclosureType;
          self.$refs.player.pause();
          self.$refs.player.load();
        });
        this.currentPlayPercentage = 0;
      } else {
        this.itemTitle = "";
        this.pause();
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

    onCanPlay() {
      console.log("Can play called");
      if (this.item != null) {
        this.play();
      }
    },

    onLoaded() {
      console.log("On loaded called");
      // Check if we have stored a playhead position for this video
      //
      var url = this.item.enclosure;
      if (localStorage.getItem("playhead:" + url) != null) {
        let time = localStorage.getItem("playhead:" + url);
        this.$refs.player.currentTime = time;
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

    onSeeked() {
      // Save the current playhead position for this video (identified by url)
      //
      if (this.item != null && this.item.enclosure != null) {
        var url = this.item.enclosure;
        var time = this.$refs.player.currentTime;
        localStorage.setItem("playhead:" + url, time);
      }
    },
    onPlay() {
      this.isPlaying = true;
    },

    onPaused() {
      this.isPlaying = false;
      this.onSeeked();
    },

    play() {
      this.$refs.player.play();
    },

    pause() {
      this.$refs.player.pause();
    },

    replay10() {
      this.$refs.player.currentTime = Math.max(
        0,
        this.$refs.player.currentTime - 10
      );
    },
    forward10() {
      this.$refs.player.currentTime = Math.min(
        this.$refs.player.duration,
        this.$refs.player.currentTime + 10
      );
    },

    onTimeUpdate() {
      // Update progress bar of current playback. TODO - allow click on progress bar to seek.
      let duration = this.$refs.player.duration;
      let current = this.$refs.player.currentTime;
      this.currentPlayPercentage = (100 * current) / duration;
    },

    minimize() {
      this.showOverlayControls = false;
      this.$emit("minimize");
    },

    maximize() {
      this.$emit("maximize");
    },

    close() {
      this.$refs.player.pause();
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