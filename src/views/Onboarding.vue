<template>
  <v-content>
    <div>
      <h3>Onboarding</h3>
    </div>
    <div>Your language is {{ language }}</div>
    <div>
      <v-btn color="orange" @click="useConfig('uyghur')">Use Uyghur</v-btn>
    </div>
    <div>
      <v-btn color="orange" @click="useConfig('english')">Use English</v-btn>
    </div>
    <div style="margin-top: 150px">
      <v-btn color="success" @click="done();">Done</v-btn>
    </div>
  </v-content>
</template>

<script>
export default {
  name: "Onboarding",
  data() {
    return {
      loadFont: false,
      configs: {
        uyghur: {
          themeBodyFont: "AlpidaUnicodeSystem",
          themeBodySize: 14,
          webFontConfig: {
            custom: {
              families: ["AlpidaUnicodeSystem"],
              urls: ["./assets/fonts/uighur.css"],
              testStrings: {
                "AlpidaUnicodeSystem": "\u067E"
              }
            }
          }
        },
        english: {
          themeBodyFont: "Indie Flower",
          themeBodySize: 14,
          webFontConfig: {
            custom: {
              families: ["Indie Flower"],
              urls: ["./assets/fonts/english.css"]
            }
          }
        }
      }
    };
  },
  computed: {
    language: function() {
      var lang = navigator.language || navigator.userLanguage;
      return lang;
    }
  },
  methods: {
    useConfig(config) {
      let c = this.configs[config];

      var WebFont = require("webfontloader");
      WebFont.load(c.webFontConfig);
      this.$store.commit("setThemeBodyFont", c.themeBodyFont);
      this.$store.commit("setThemeBodySize", c.themeBodySize);
    },

    done() {
      this.$root.onboarded = true;
      this.$root.$router.replace("/");
    }
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
</style>