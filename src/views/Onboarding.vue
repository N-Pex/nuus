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