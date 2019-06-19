<template>
  <v-content>
    <div>
      <h3>Onboarding</h3>
    </div>
    <div>Your language is {{ language }}</div>
    <div>Note: this page is under contruction.</div>
    <div class="ma-3">
      <v-btn block color="orange" @click="useConfig('uyghur')">Use Uyghur</v-btn>
    </div>
    <div class="ma-3">
      <v-btn block color="orange" @click="useConfig('burmese')">Use Burmese</v-btn>
    </div>
    <div class="ma-3">
      <v-btn block color="orange" @click="useConfig('mandarin')">Use Mandarin</v-btn>
    </div>
    <div class="ma-3">
      <v-btn block color="orange" @click="useConfig('cantonese')">Use Cantonese</v-btn>
    </div>
    <div class="ma-3">
      <v-btn block color="orange" @click="useConfig('english')">Use English</v-btn>
    </div>
  </v-content>
</template>

<script>

import flavors from '../config';

export default {
  name: "Onboarding",
  data() {
    return {
      loadFont: false,
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
      this.$store.commit("setFlavor", config);
      this.done();
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