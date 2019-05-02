<template>
<v-content>
      <div>Onboarding</div>
      <v-btn color="success" @click="done();">Done</v-btn>
</v-content>
</template>

<script>

export default {
  name: 'Onboarding',
  computed: {
        onboarded: {
          get: function () {
            return this.$store.state.onboarded;
          },
          set: function (val) {
            this.$store.commit("onboarded", val);
          }
        }
  },
  methods: {
    done() {
      console.log("Setting onboarded to true from " + this.onboarded);
      this.onboarded = true;
      this.$root.$router.replace("/");
    }
  }
}
</script>
