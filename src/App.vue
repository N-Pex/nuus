<template>
  <v-app :style="themeCSSVariables">
    <router-view :style="cssProps"/>
  </v-app>
</template>

<script>
import flavors from "./config";
import ItemModel from "./models/itemmodel";

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

var temp = new ItemModel();
Object.defineProperty(ItemModel.prototype, 'hasVideoAttachment', {
     enumerable: false,
     value: function () {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("video") === 0
        );
       }
});
Object.defineProperty(ItemModel.prototype, 'hasAudioAttachment', {
     enumerable: false,
     value: function () {
        return (
            this.enclosureType != null &&
            this.enclosureType.indexOf("audio") === 0
        );
       }
});

export default {
  name: "App",
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
      // For text scaling to work correctly, we take all the unscaled theme sizes and scale them here, so that
      // the CSS code can either use the "unscaled" --v-theme-xyz-font-size values or the scaled ones
      // (--v-theme-xyz-font-size-scaled).
      let flavor = flavors[this.flavorName];
      let factor = 1 + 0.3 * (this.$store.state.textSizeAdjustment) / 6;
      return {
        "--v-theme-title-font-size-scaled": "calc(var(--v-theme-title-font-size) * " + factor + ")",
        "--v-theme-title-line-height-scaled": "calc(var(--v-theme-title-line-height) * " + factor + ")",
        "--v-theme-title-line-height-scaled-x2": "calc(var(--v-theme-title-line-height) * 2 * " + factor + ")",
        "--v-theme-body-font-size-scaled": "calc(var(--v-theme-body-font-size) * " + factor + ")",
        "--v-theme-body-line-height-scaled": "calc(var(--v-theme-body-line-height) * " + factor + ")",
        "--v-theme-body-line-height-scaled-x2": "calc(var(--v-theme-body-line-height) * 2 * " + factor + ")",
        "--v-theme-body-line-height-scaled-x4": "calc(var(--v-theme-body-line-height) * 4 * " + factor + ")",
        "--v-theme-date-font-size-scaled": "calc(var(--v-theme-date-font-size) * " + factor + ")",
        "--v-theme-date-line-height-scaled": "calc(var(--v-theme-date-line-height) * " + factor + ")",

        /* Media sizes */
        "--v-theme-media-title-font-size-scaled": "calc(var(--v-theme-media-title-font-size) * " + factor + ")",
        "--v-theme-media-title-line-height-scaled": "calc(var(--v-theme-media-title-line-height) * " + factor + ")",
        "--v-theme-media-title-line-height-scaled-x2": "calc(var(--v-theme-media-title-line-height) * 2 * " + factor + ")",
        "--v-theme-media-body-font-size-scaled": "calc(var(--v-theme-media-body-font-size) * " + factor + ")",
        "--v-theme-media-body-line-height-scaled": "calc(var(--v-theme-media-body-line-height) * " + factor + ")",
        "--v-theme-media-body-line-height-scaled-x2": "calc(var(--v-theme-media-body-line-height) * 2 * " + factor + ")"
      };
    }
  }
};
</script>
