<template>
  <v-app :style="themeCSSVariables">
    <router-view :style="cssProps" />
  </v-app>
</template>

<script>
import flavors from "./config";
import ItemModel from "./models/itemmodel";
import rssparser from "./services/rssparser";

// Make sure Array.isArray is defined
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

if (!String.hashCode) {
  console.log("Defining a hash function");
  String.hashCode = function(str) {
    var hash = 0,
      i = 0,
      len = str.length;
    while (i < len) {
      hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
    }
    return hash + 2147483647 + 1;
  };
}

var temp = new ItemModel();
Object.defineProperty(ItemModel.prototype, "hasVideoAttachment", {
  enumerable: false,
  value: function() {
    return (
      this.enclosureType != null && this.enclosureType.indexOf("video") === 0
    );
  }
});
Object.defineProperty(ItemModel.prototype, "hasAudioAttachment", {
  enumerable: false,
  value: function() {
    return (
      this.enclosureType != null && this.enclosureType.indexOf("audio") === 0
    );
  }
});

export default {
  name: "App",
  mounted() {
    console.log("App mounted");
    this.storeWatchObject = this.$store.watch(
      state => state.flavor,
      (oldValue, newValue) => {
        console.log("Flavor is changing");
        this.updateFlavor();
      }
    );
    this.updateFlavor();
  },

  destroyed() {
    if (this.storeWatchObject != null) {
      this.storeWatchObject();
      this.storeWatchObject = null;
    }
  },

  updated() {
    console.log("App updated");
    // let flavor = flavors[this.$store.state.flavor];
    // if (process.env.NODE_ENV === "production") {
    //   // For production builds, default to first url in config.
    //   this.urlUpdated(flavor.feeds[0].url);
    // } else {
    //   this.urlUpdated("./assets/nasa.xml");
    // }
  },

  data() {
    return {
      url: "Please enter a URL"
    }
  },

  methods: {
    updateFlavor() {
      console.log("SET FLAVOR TO " + this.$store.state.flavor);
      let flavor = flavors[this.$store.state.flavor];

      // Set RTL from config
      this.$vuetify.rtl = flavor.isRTL;

      // Insert link to font style sheet so the web font loader will find the fonts.
      if (flavor.webFontCssFile != "") {
        var file = document.getElementById("fontThemeLink");
        if (file == null) {
          console.log("Theme link not found, creating!");
          file = document.createElement("link");
          file.id = "fontThemeLink";
          document.head.appendChild(file);
        } else {
          console.log("Theme link found, reusing");
        }
        file.rel = "stylesheet";
        file.type = "text/css";
        file.href = flavor.webFontCssFile;
      }

      var WebFont = require("webfontloader");
      WebFont.load(flavor.webFontConfig);

      if (process.env.NODE_ENV === "production") {
        // For production builds, default to first url in config.
        this.urlUpdated(flavor.feeds[0].url);
      } else {
        this.urlUpdated("./assets/nasa.xml");
      }
    },

    urlUpdated(url) {
      this.url = url;
      const self = this;
      rssparser.fetchUrl(url, function(feed, items) {
        self.$store.commit("setCurrentFeedTitle", feed.title);
        self.$store.commit("setCurrentFeedItems", items);
      });
    },

    // Convert a css text string to a javascript object.
    // Taken from https://stackoverflow.com/questions/8987550/convert-css-text-to-javascript-object
    // Note: modified to not apply cssToJs on property names.
    parseCSSText(cssText) {
      var cssTxt = cssText
        .replace(/\/\*(.|\s)*?\*\//g, " ")
        .replace(/\s+/g, " ");
      var style = {},
        [, ruleName, rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];
      //var cssToJs = s => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());
      var properties = rule
        .split(";")
        .map(o => o.split(":").map(x => x && x.trim()));
      for (var [property, value] of properties) style[property] = value;
      return { cssText, ruleName, style };
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
      let factor = 1 + (0.3 * this.$store.state.textSizeAdjustment) / 6;
      return {
        "--v-theme-title-font-size-scaled":
          "calc(var(--v-theme-title-font-size) * " + factor + ")",
        "--v-theme-title-line-height-scaled":
          "calc(var(--v-theme-title-line-height) * " + factor + ")",
        "--v-theme-title-line-height-scaled-x2":
          "calc(var(--v-theme-title-line-height) * 2 * " + factor + ")",
        "--v-theme-title-line-height-scaled-x6":
          "calc(var(--v-theme-title-line-height) * 6 * " + factor + ")",
        "--v-theme-body-font-size-scaled":
          "calc(var(--v-theme-body-font-size) * " + factor + ")",
        "--v-theme-body-line-height-scaled":
          "calc(var(--v-theme-body-line-height) * " + factor + ")",
        "--v-theme-body-line-height-scaled-x2":
          "calc(var(--v-theme-body-line-height) * 2 * " + factor + ")",
        "--v-theme-body-line-height-scaled-x4":
          "calc(var(--v-theme-body-line-height) * 4 * " + factor + ")",
        "--v-theme-date-font-size-scaled":
          "calc(var(--v-theme-date-font-size) * " + factor + ")",
        "--v-theme-date-line-height-scaled":
          "calc(var(--v-theme-date-line-height) * " + factor + ")",

        /* Media sizes */
        "--v-theme-media-title-font-size-scaled":
          "calc(var(--v-theme-media-title-font-size) * " + factor + ")",
        "--v-theme-media-title-line-height-scaled":
          "calc(var(--v-theme-media-title-line-height) * " + factor + ")",
        "--v-theme-media-title-line-height-scaled-x2":
          "calc(var(--v-theme-media-title-line-height) * 2 * " + factor + ")",
        "--v-theme-media-body-font-size-scaled":
          "calc(var(--v-theme-media-body-font-size) * " + factor + ")",
        "--v-theme-media-body-line-height-scaled":
          "calc(var(--v-theme-media-body-line-height) * " + factor + ")",
        "--v-theme-media-body-line-height-scaled-x2":
          "calc(var(--v-theme-media-body-line-height) * 2 * " + factor + ")"
      };
    }
  }
};
</script>
