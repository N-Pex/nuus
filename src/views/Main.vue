<template>
  <div>
    <div class="contentView">
    <transition name="fade" mode="out-in">
      <router-view :key="$route.fullPath" />
    </transition>
    </div>

    <v-bottom-navigation fixed height="60px" v-model="activeTab" color="red" class="navigationBar">
      <v-btn @click="showHome"><v-icon class="small">$vuetify.icons.logo</v-icon></v-btn>
      <v-btn @click="showCategories"><v-icon class="small">$vuetify.icons.categories</v-icon></v-btn>
      <v-btn @click="showRadio"><v-icon class="small">$vuetify.icons.radio</v-icon></v-btn>
      <v-btn @click="showSaved"><v-icon class="small">$vuetify.icons.favorites</v-icon></v-btn>
      <v-btn @click="showMore"><v-icon class="small">$vuetify.icons.more</v-icon></v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: "Main",
  components: {},
  data() {
    return {
      activeTab: null,
      transitionName: null
    };
  },
  watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'fade' : 'fade'
    console.log("Transition now: " + this.transitionName);
  }
  },

  methods: {
    showHome() {
      this.closeMediaPlayer();
      this.$router.replace("/home");
    },

    showCategories() {
      this.closeMediaPlayer();
      this.$router.replace("/categories");
    },

    showSaved() {
      this.closeMediaPlayer();
      this.$router.replace("/saved");
    },

    showRadio() {
      console.log("Show radio - TODO");
    },

    showMore() {
      console.log("Show more - TODO");
    },

    closeMediaPlayer() {
      if (this.$root.mediaPlayer != null) {
        this.$root.mediaPlayer.item = null;
      }
      this.$root.mediaPlayer = null;
      this.$root.mediaPlayerInvisible = false;
    }
  }
};
</script>

<style scoped>
@import url("../assets/item-style.css");
@import url("../assets/shared-styles.css");

.contentView {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 60px;
  right: 0px;
  overflow-y: hidden;
}

.navigationBar {
  position: fixed;
  background-color: #fafafa;
}

</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
