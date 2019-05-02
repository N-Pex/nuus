<template>
<v-content>
      <div><h3>Onboarding</h3></div>
      <div>Your language is {{ language }}</div>
      <v-btn color="success" @click="done();">Done</v-btn>
</v-content>
</template>

<script>

export default {
  name: 'Onboarding',
  computed: {
    language: function() {
      var lang = navigator.language || navigator.userLanguage; 
      return lang;
    }
  },
  methods: {
    done() {
      this.$root.onboarded = true;
      this.$root.$router.replace("/");
    }
  }
}
</script>

<style scoped>
@import url("../assets/item-style.css");
</style>