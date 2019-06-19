<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-menu offset-y data-app>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">home</v-icon>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, index) in menuItems"
            :key="index"
            @click="menuItemClicked(item.url)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-flex>
        <v-text-field
          v-model="dataUrl"
          append-icon="get_app"
          @click:append="loadIconClicked"
        >This is the url</v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import flavors from "../config";

export default {
  props: {
    url: String
  },
  mounted: function() {
    let feeds = flavors[this.$store.state.flavor].feeds;
    for (var i = 0; i < feeds.length; ++i) {
      let feed = feeds[i];
      this.menuItems.splice(i, 0, {title: feed.title, url: feed.url});
    }
  },
  data: () => ({
    menuItems: [
      { title: "NASA Audio/Video test feed", url: "./assets/nasa.xml" }
/*      { title: "The Guardian", url: "./assets/test.xml" },
      { title: "Zipped bundle", url: "./assets/bundle.zip" },
      { title: "NASA Audio", url: "./assets/nasa2.xml" }*/
    ],
    dataUrl: ""
  }),
  methods: {
    loadIconClicked() {
      this.$emit("update:url", this.dataUrl);
    },
    menuItemClicked(url) {
      this.dataUrl = url;
      this.loadIconClicked();
    }
  }
};
</script>
