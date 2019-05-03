<template>
  <v-card class="ma-3">
    <div v-if="$root.showMedia">
      <video
        v-if="item.hasVideoEnclosure()"
        ref="video"
        width="100%"
        controls
        @timeupdate="onTimeUpdate"
        v-bind:currentTime.prop="savedPlayTime(item.enclosure)"
      >
        <source :src="enclosureURL" :type="item.enclosureType">Your browser does not support the video tag.
      </video>
      <audio v-if="item.hasAudioEnclosure()" ref="audio" width="100%" controls>
        <source :src="enclosureURL" :type="item.enclosureType">Your browser does not support the audio tag.
      </audio>
      <v-img v-else-if="item.imageSrc != null" :src="imageUrl()" aspect-ratio="2.75"></v-img>
    </div>
    <v-card-title primary-title>
      <div>
        <h3>{{ item.title }}</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <div v-html="item.pubDate" class="date"/>
      <div v-html="item.description" class="body"/>
    </v-card-text>

    <v-card-actions>
      <v-btn flat color="accent">Share</v-btn>
      <v-btn flat color="accent">Explore</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";

export default {
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },

  mounted: function() {
    var self = this;
    if (this.$root.showMedia) {
      if (this.item.hasVideoEnclosure()) {
        this.enclosure().then(function(res) {
          self.enclosureURL = res;
          self.$refs.video.load();
        });
      } else if (this.item.hasAudioEnclosure()) {
        this.enclosure().then(function(res) {
          self.enclosureURL = res;
          self.$refs.audio.load();
        });
      }
    }
  },
  data: () => ({
    enclosureURL: ""
    //   savedPlayTime: 30
  }),
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
    imageUrl() {
      if (this.item.imageSrc.startsWith("file://")) {
        console.log("It is a file");
      }
      return this.item.imageSrc;
    },
    onTimeUpdate() {
      // Save playhead position
      var url = this.item.enclosure;
      //TODO - save audio as well
      var time = this.$refs.video.currentTime;
      localStorage.setItem("playhead:" + url, time);
    },
    savedPlayTime(url) {
      // Get saved playhead position, if any
      if (localStorage.getItem("playhead:" + url) != null) {
        return localStorage.getItem("playhead:" + url);
      }
      return 0;
    }
  }
};
</script>
