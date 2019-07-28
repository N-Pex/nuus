<template>
  <div>
    <div class="contentView">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    </div>

    <v-bottom-navigation fixed height="80px" v-model="activeTab" color="red" class="navigationBar">
      <v-btn to="/home" replace>Home</v-btn>
      <v-btn to="/categories" replace>Categories</v-btn>
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
  bottom: 80px;
  right: 0px;
  overflow-y: hidden;
}

.navigationBar {
  position: fixed;
  background-color: rgba(123,0,255,0.6);
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
