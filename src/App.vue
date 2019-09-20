<template>
  <v-app>
    <PrintItem id="printedItem" ref="printedItem" v-if="printedItem != null" :item="printedItem" v-on:imageUrlSet="printItemLoaded" />
    <router-view />
  </v-app>
</template>

<script>
import flavors from "./config";
import ItemModel from "./models/itemmodel";
import rssparser from "./services/rssparser";
import PrintItem from "./components/PrintItem";

document.documentElement.style.setProperty('--v-scale-factor', 1);

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


export default {
  name: "App",
  components: {
    PrintItem
  },
  mounted() {
    console.log("App mounted");
    this.storeWatchObject = this.$store.watch(
      state => state.flavor,
      (oldValue, newValue) => {
        console.log("Flavor is changing");
        this.updateFlavor();
      }
    );
    const self = this;
    this.storeWatchObjectTextSize = this.$store.watch(
      state => state.textSizeAdjustment,
      (oldValue, newValue) => {
        self.textSizeUpdated(newValue);
      }
    );
    this.updateFlavor();
    this.textSizeUpdated(this.$store.state.textSizeAdjustment);
  },

  destroyed() {
    if (this.storeWatchObject != null) {
      this.storeWatchObject();
      this.storeWatchObject = null;
    }
    if (this.storeWatchObjectTextSize != null) {
      this.storeWatchObjectTextSize();
      this.storeWatchObjectTextSize = null;
    }
  },

  data() {
    return {
      url: "Please enter a URL",
      printedItem: null
    }
  },

  methods: {

    shareItem(item) {
      //TODO
      console.log("Share item: " + item.title);
    },

    printItem(item) {
      // Set "printedItem". This will result in ParintItem getting showed. We then wait for the
      // event "itemUrlSet" to continue the print operation after that. See "printItemLoaded" below.
      this.printedItem = item;
    },

    printItemLoaded() {
      const self = this;

      // Wait a tick to allow everything to settle.
      this.$nextTick(function() {
        window.focus();
        window.onafterprint = function(event) {
          self.printedItem = null;
          window.onafterprint = null;
        };
        window.print();
      });
    },

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
        this.serviceUpdated(flavor.services[0]);
      } else {
        this.serviceUpdated({title: "Nasa Test", url: "./assets/nasa.xml", categories: []});
      }

      document.documentElement.style.setProperty('--v-theme-font', flavor.webFontName);
      document.documentElement.style.setProperty('--v-theme-font-size', flavor.webFontSize);
    },

    textSizeUpdated(adjustment) {
        let factor = 1 + ((adjustment > 0 ? 0.4 : 0.2) * adjustment) / 100;
        document.documentElement.style.setProperty('--v-scale-factor', factor);
    },

    serviceUpdated(service) {
      this.url = service.url;
      const self = this;
      self.$store.commit("clearCategories");
      rssparser.fetchUrl(this.url, function(feed, items) {
        self.$store.commit("setCurrentFeedTitle", feed.title);
        self.$store.commit("setCurrentFeedItems", items);
        if (service.categories != null) {
          for (var i = 0; i < service.categories.length; i++) {
            const index = i;
            var category = service.categories[i];
            let url = category.url;
            rssparser.fetchUrl(url, function(feed, items) {
              var catTitle = feed.category;
              if (catTitle == null || catTitle.length == 0) {
                catTitle = "Category " + (index + 1);
              }
              self.$store.commit("addCategoryItems", {category: catTitle, feed: feed, items: items});
            });
          }
        }
      });
    }
  },

  computed: {
    flavorName() {
      return this.$store.state.flavor;
    }
  }
};
</script>

<style>
@import url("./assets/css/sizes.css");
@media screen {
  #printedItem {
    display: none;
   }
}

@media print {
 body * {
  visibility:hidden;
  }
  #printedItem, #printedItem * {
    visibility:visible !important;
  }
  #printedItem {
    position: absolute !important;
    left:0;
    top:0;
    width: 100%;
  }
}
</style>
