<template>
  <v-app :style="themeCSSVariables">
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

  methods: {
    // Convert a css text string to a javascript object.
    // Taken from https://stackoverflow.com/questions/8987550/convert-css-text-to-javascript-object
    // Note: modified to not apply cssToJs on property names.
    parseCSSText(cssText) {
      var cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
      var style = {}, [,ruleName,rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/)||[,,cssTxt];
      //var cssToJs = s => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());
      var properties = rule.split(";").map(o => o.split(":").map(x => x && x.trim()));
      for (var [property, value] of properties) style[property] = value;
      return {cssText, ruleName, style};
    } /* updated 2017-09-28 */
  },

  computed: {
    flavorName() {
      return this.$store.state.flavor;
    },
    themeCSSVariables() {
      let flavor = flavors[this.flavorName];
      var cssText = flavor.themeCSSVariables;
      let style = this.parseCSSText(cssText).style;
      return style;
    },
    cssProps() {
      let flavor = flavors[this.flavorName];
      let factor = 1 + 0.3 * (this.$store.state.textSizeAdjustment) / 6;
      return {
        "--v-theme-title-font-size-scaled": "calc(var(--v-theme-title-font-size) * " + factor + ")",
        "--v-theme-title-line-height-scaled": "calc(var(--v-theme-title-line-height) * " + factor + ")",
        "--v-theme-title-line-height-scaled-x2": "calc(var(--v-theme-title-line-height) * 2 * " + factor + ")",
        "--v-theme-body-font-size-scaled": "calc(var(--v-theme-body-font-size) * " + factor + ")",
        "--v-theme-body-line-height-scaled": "calc(var(--v-theme-body-line-height) * " + factor + ")",
        "--v-theme-body-line-height-scaled-x4": "calc(var(--v-theme-body-line-height) * 4 * " + factor + ")"
      };
    }
  }
};
</script>
