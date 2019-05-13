<template>
  <v-app>
    <router-view :style="cssProps"/>
  </v-app>
</template>

<script>
import UrlInput from "./components/UrlInput";
import ItemList from "./components/ItemList";
import axios from "axios";
import sanitizeHTML from "sanitize-html";
import db from "./database";
import { constants } from "fs";
import flavors from "./config";

//import xml2js from "xml2js";

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

export default {
  name: "App",
  components: {
    UrlInput,
    ItemList
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
    };
  },

  mounted() {
    console.log("App mounted");
  },

  computed: {
    cssProps() {
      let flavor = flavors[this.$store.state.flavor];
      let fontDeclaration =
        (flavor.themeBodySize +
          this.$store.state.textSizeAdjustment) +
        "pt" + " '" + flavor.themeBodyFont +
        "'";
      console.log("Returning font declaration: " + fontDeclaration);
      return {
        "--v-theme-body-font": fontDeclaration
      };
    }
  }
};
</script>

