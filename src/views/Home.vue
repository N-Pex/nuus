<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>NUUS</span>
        <span class="font-weight-light">RSS READER</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position:fixed; top:0; left:0; overflow-y:scroll;"
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="img/icons/apple-touch-icon-60x60.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>NUUS</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in menuItems" :key="item.title" @click>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click>
          <v-list-tile-action>
            <v-checkbox v-model="$root.showMedia"></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-content @click="$root.showMedia = !$root.showMedia">
            <v-list-tile-title>Show media</v-list-tile-title>
            <v-list-tile-sub-title>Show images, video and audio</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-content>
            <v-slider v-model="textSizeAdjustment" prepend-icon="text_fields" min="-6" max="6"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <UrlInput v-on:update:url="urlUpdated($event)" v-bind:url="url"/>
      <ItemList v-bind:items="items" v-on:itemClicked="itemClicked($event)"/>
    </v-content>
  </v-app>
</template>

<script>
import UrlInput from "../components/UrlInput";
import ItemList from "../components/ItemList";
import axios from "axios";
import sanitizeHTML from "sanitize-html";
import db from "../database";
import rssparser from "../services/rssparser";

export default {
  name: "Home",
  components: {
    UrlInput,
    ItemList
  },
  methods: {
    urlUpdated(url) {
      this.url = url;
      const self = this;
      rssparser.fetchUrl(url, function(items) {
        self.items = items;
      });
    },
    itemClicked(eventInfo) {
      console.log(
        "Item clicked " + eventInfo.item.title + " at rect " + eventInfo.rect
      );
    }
  },
  data() {
    return {
      url: "Please enter a URL",
      items: [],
      drawer: null,
      menuItems: [
        /*
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
        */
      ]
      //
    };
  },
  computed: {
    textSizeAdjustment: {
      get: function() {
        return this.$store.state.textSizeAdjustment;
      },
      set: function(val) {
        this.$store.commit("setTextSizeAdjustment", val);
      }
    }
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
</style>