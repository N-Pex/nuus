<template>
  <div>
    <div class="contentView" style="z-index: 3">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view :key="$route.path" />
        </keep-alive>
      </transition>
    </div>

    <v-bottom-navigation
      fixed
      height="60px"
      style="z-index: 2"
      v-model="activeTab"
      color="green"
      class="navigationBar"
    >
      <v-btn @click="showHome">
        <v-icon class="small">$vuetify.icons.logo</v-icon>
      </v-btn>
      <v-btn @click="showCategories">
        <v-icon class="small">$vuetify.icons.categories</v-icon>
      </v-btn>
      <v-btn @click="showRadio">
        <v-icon class="small">$vuetify.icons.radio</v-icon>
      </v-btn>
      <v-btn @click="showSaved">
        <v-icon class="small">$vuetify.icons.favorites</v-icon>
      </v-btn>

      <v-dialog v-model="showSettings" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">
            <v-icon class="small">$vuetify.icons.more</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Settings</span>
          </v-card-title>
          <v-card-text>
            <v-list class="pt-0" dense>
              <v-list-item>
                <v-list-item-content>
                  <v-slider
                    v-model="textSizeAdjustment"
                    prepend-icon="text_fields"
                    min="-100"
                    max="100"
                  />
                </v-list-item-content>
              </v-list-item>

              <v-subheader>Service</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <UrlInput
                    v-on:update:service="serviceUpdated($event)"
                    v-bind:url="this.$root.appInstance.componentInstance.url"
                  />
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-btn block @click="showOnboarding()">Show onboarding</v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showSettings = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-bottom-navigation>
  </div>
</template>

<script>
import UrlInput from "../components/UrlInput";

export default {
  name: "Main",
  components: {
    UrlInput
  },
  data() {
    return {
      activeTab: null,
      oldActiveTab: null,
      transitionName: null,
      showSettings: false
    };
  },
  computed: {
    textSizeAdjustment: {
      get: function() {
        return this.$store.state.textSizeAdjustment;
      },
      set: function(val) {
        this.$store.commit("setTextSizeAdjustment", val);
      }
    }
  },
  watch: {
    showSettings: function() {
      if (!this.showSettings) {
        // Restore selected tab
        this.activeTab = this.oldActiveTab;
      }
    },
    // Never allow the settings dialog to be active...
    activeTab: function() {
      console.log("Set active to " + this.activeTab);
      if (this.activeTab != 4) {
        this.oldActiveTab = this.activeTab;
      }
    },
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "fade" : "fade";
      console.log("Transition now: " + this.transitionName);
    }
  },

  methods: {
    showHome() {
      this.activeTab = 0;
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
      this.closeMediaPlayer();
      this.$router.replace("/radio");
    },

    showOnboarding() {
      this.$router.push("/onboarding");
    },

    closeMediaPlayer() {
      if (this.$root.mediaPlayer != null) {
        this.$root.mediaPlayer.item = null;
      }
      this.$root.mediaPlayer = null;
      this.$root.mediaPlayerInvisible = false;
    },

    serviceUpdated(service) {
      this.oldActiveTab = 0;
      this.showSettings = false;
      this.$root.appInstance.componentInstance.serviceUpdated(service);
      this.showHome();
    }
  }
};
</script>

<style scoped>
@import url("../assets/css/item-style.css");
@import url("../assets/css/shared-styles.css");

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
  opacity: 0;
}
</style>
