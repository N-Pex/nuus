<template></template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import { constants } from "crypto";
import MediaCache from "../mediacache";

export default {
  props: {
    isDocked: false,
    isInvisible: false
  },
  data: () => ({
    item: new ItemModel(),
    itemTitle: "",
    autoPlay: false,
    isPlaying: false,
    imageUrl: null,
    enclosureURL: "",
    enclosureType: null,
    duration: 0,
    currentPlaySeconds: 0,
    currentPlayPercentage: 0,
    showOverlayControls: false,
    overlayTimeoutObject: null
  }),
  mounted: function() {
    this.update();
  },
  watch: {
    item: function() {
      this.autoPlay = true;
      this.update();
    }
  },
  
  destroyed: function() {
    MediaCache.releaseMedia(this.enclosureURL);
    this.enclosureURL = null;
  },

  computed: {},
  filters: {
    timeInColonFormat: function(value) {
    let hours =  parseInt(Math.floor(value / 3600)); 
    let minutes = parseInt(Math.floor((value - (hours * 3600)) / 60)); 
    let seconds= parseInt((value - ((hours * 3600) + (minutes * 60))) % 60); 

    let dHours = (hours > 9 ? hours : '0' + hours);
    let dMins = (minutes > 9 ? minutes : '0' + minutes);
    let dSecs = (seconds > 9 ? seconds : '0' + seconds);
    if (hours > 0) {
      return dHours + ":" + dMins + ":" + dSecs;
    }
    return dMins + ":" + dSecs;
    }
  },
  methods: {
    load(item, autoplay) {
      this.item = item;
      this.autoplay = autoplay;
    },

    update() {
      if (
        this.item != null &&
        (this.item.hasVideoAttachment() || this.item.hasAudioAttachment())
      ) {
        this.itemTitle = this.item.title;
        const self = this;
        this.enclosure(function(url) {
          self.enclosureURL = url;
          self.enclosureType = self.item.enclosureType;
          self.$refs.player.pause();
          self.$refs.player.load();
        });
        this.currentPlaySeconds = 0;
        this.currentPlayPercentage = 0;
        this.duration = 0;
              
        this.imageUrl = this.item.imageSrc;

        // If no thumbnail, try generic feed image
        if (this.imageUrl == null) {
          db.getFeed(this.item.feed).then(feed => {
            if (feed != null) {
              this.imageUrl = feed.imageUrl;
            }
          });
        }
      } else {
        this.itemTitle = "";
        this.currentPlaySeconds = 0;
        this.currentPlayPercentage = 0;
        this.duration = 0;
        this.imageUrl = null;
        this.pause();
      }
    },

    enclosure(callback) {
      if (this.item != null && this.item.enclosure != null) {
        MediaCache.getMedia(this.item.enclosure, false, function(url) {
          callback(url);
        });
      }
    },

    onCanPlay() {
      if (this.item != null && this.autoPlay) {
        this.autoPlay = false;
        console.log("Can play called");
        this.play();
      }
    },

    onLoaded() {
      console.log("On loaded called");

      this.duration = this.$refs.player.duration;

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
        };
        navigator.mediaSession.metadata = new MediaMetadata(meta);
        db.getFeed(this.item.feed).then(feed => {
          if (feed != null) {
            navigator.mediaSession.metadata.artist = feed.title;
            if (feed.imageUrl != null) {
              console.log("Set artwork to " + feed.imageUrl);
              navigator.mediaSession.metadata.artwork = [
                {
                  src: feed.imageUrl
               }
              ];
            }
          }
        });
      }
    },

    onSeeked() {
      // Save the current playhead position for this video (identified by url)
      //
      if (this.item != null && this.item.enclosure != null && this.$refs.player != null) {
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
      if (this.$refs.player != null) {
        this.$refs.player.pause();
      }
    },

    seekToPercentage(percentage) {
      this.$refs.player.currentTime = this.$refs.player.duration * percentage / 100;
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
      let current = Math.round(this.$refs.player.currentTime);
      if (current != this.currentPlaySeconds) {
        this.currentPlaySeconds = current;
        this.currentPlayPercentage = Math.round((100 * current) / duration);
        this.$root.$emit("currentPlayPercentage", {
          item: this.item,
          currentPlaySeconds: this.currentPlaySeconds,
          currentPlayPercentage: this.currentPlayPercentage
        });
      }
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
      this.overlayTimeoutObject = null;
      if (this.isDocked) {
        this.showOverlayControls = false;
      } else {
        this.showOverlayControls = !this.showOverlayControls;
        if (this.showOverlayControls) {
          this.overlayTimeoutObject = setTimeout(this.showHideOverlayControls, 3000);
        }
      }
    },

    enableOverlayControlsTimeout(enable) {
      if (this.overlayTimeoutObject != null) {
        clearTimeout(this.overlayTimeoutObject);
        this.overlayTimeoutObject = null;
      }
      if (enable) {
          this.overlayTimeoutObject = setTimeout(this.showHideOverlayControls, 3000);
      }
    }

  }
};
</script>
