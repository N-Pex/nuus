<template>
  <v-container>
    <v-layout text-center wrap>
      <v-menu offset-y data-app>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">home</v-icon>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            @click="serviceSelected(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
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
    let services = flavors[this.$store.state.flavor].services;
    for (var i = 0; i < services.length; ++i) {
      let service = services[i];
      this.menuItems.splice(i, 0, service);
    }
  },
  data: () => ({
    menuItems: [
      { title: "NASA Audio/Video test feed", url: "./assets/nasa.xml", categories: [] }
/*      { title: "The Guardian", url: "./assets/test.xml" },
      { title: "Zipped bundle", url: "./assets/bundle.zip" },
      { title: "NASA Audio", url: "./assets/nasa2.xml" }*/
    ],
    dataUrl: "",
    service: null
  }),
  watch: {
    dataUrl() {
      this.service = {title: "Custom feed", url: this.data, categories: []};
    }
  },
  methods: {
    loadIconClicked() {
      this.$emit("update:service", this.service);
    },
    serviceSelected(service) {
      this.service = service;
      this.loadIconClicked();
    }
  }
};
</script>
