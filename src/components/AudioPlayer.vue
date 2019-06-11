<template>
  <div :class="{ 'videoPlayerRoot': true, docked: isDocked }">
    <v-container fill-height fluid ma-0 pa-0>
      <v-layout fill-height align-center row ma-0 pa-0>
        <v-flex fill-height ma-0 pa-0 xs12 v-show="!isDocked" style="display: grid">
          <div style="grid-column: 1; grid-row: 1">
            <!-- VIDEO PLAYER -->
            <video
              class="videoPlayer"
              ref="player"
              @click="showHideOverlayControls"
              @loadeddata="onLoaded"
              @seeked="onSeeked"
              @pause="onPaused"
              @play="onPlay"
              @timeupdate="onTimeUpdate"
            >
              <source :src="enclosureURL" :type="enclosureType">Your browser does not support the video tag.
            </video>
          </div>
          <transition name="fade">
            <div
              class="overlayControls"
              style="grid-column: 1; grid-row: 1"
              v-show="!isDocked"
            >
              <!-- TOP PART - MINIMIZE AND CLOSE BUTTONS -->
              <v-btn
                flat
                icon
                color="black"
                @click="minimize()"
                class="ma-2 pa-0"
                style="position: absolute; left: 0; top: 0"
              >
                <v-icon medium>$vuetify.icons.collapse</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                color="black"
                @click="close()"
                class="ma-2 pa-0"
                style="position: absolute; right: 0; top: 0"
              >
                <v-icon medium>$vuetify.icons.close</v-icon>
              </v-btn>

              <!-- MIDDLE PART - REPLAY, PLAY AND SKIP -->
              <v-container fluid fill-height pa-0 ma-0>
                <v-layout align-center justify-center row pa-0 ma-0>
                  <v-flex xs2 class="text-xs-center">
                    <v-btn flat icon color="black" @click="replay10()" class="ma-2 pa-0 medium-button">
                      <v-icon>$vuetify.icons.replay10</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-xs-center">
                    <v-btn
                      v-show="!isPlaying"
                      flat
                      icon
                      color="black"
                      @click="play()"
                      class="ma-2 pa-0 large-button"
                    >
                      <v-icon>$vuetify.icons.play</v-icon>
                    </v-btn>
                    <v-btn
                      v-show="isPlaying"
                      flat
                      icon
                      color="black"
                      @click="pause()"
                      class="ma-2 pa-0 large-button"
                    >
                      <v-icon>$vuetify.icons.pause</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-xs-center">
                    <v-btn flat icon color="black" @click="forward10()" class="ma-2 pa-0 medium-button">
                      <v-icon>$vuetify.icons.forward10</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- BOTTOM PART - PROGRESS -->
              <v-progress-linear
                style="max-height: 7px; position: absolute; bottom: 0; left: 0; right: 0"
                class="ma-0 pa-0"
                background-color="gray"
                color="green lighten-1"
                :value="currentPlayPercentage"
              ></v-progress-linear>
            </div>
          </transition>
        </v-flex>
        <v-flex xs10 v-show="isDocked" fill-height @click="maximize()" class="ml-3 text-xs-center">
          <v-btn
            class="ma-0 pa-0"
            flat
            small
            icon
            color="black"
            @click="maximize()"
            style="min-width: 0;min-height: 0; position:relative;top:0px">
            <v-icon>$vuetify.icons.expand</v-icon>
          </v-btn>
          <div class="text-xs-left dockedTitle">{{ item.title }}</div>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-xs-center">
          <v-btn v-show="!isPlaying" flat medium icon color="black" @click="play()">
            <v-icon>$vuetify.icons.play</v-icon>
          </v-btn>
          <v-btn v-show="isPlaying" flat medium icon color="black" @click="pause()">
            <v-icon>$vuetify.icons.pause</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-xs-center mr-3">
          <v-btn flat medium icon color="black" @click="close()">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import MediaPlayerBase from './MediaPlayerBase.vue';

export default {
  extends: MediaPlayerBase
};
</script>

<style scoped>
.videoPlayerRoot {
  position: fixed;
  left: 0;
  top: 56px;
  right: 0;
  bottom: 66%;
  background-color: #000;
  z-index: 2;
  transition: 0.3s;
}

.docked {
  position: fixed;
  background-color: #fafafa;
  top: calc(100vh - 70px);
  left: 0px;
  width: calc(100vw - 0px);
  height: 70px;
  border: 1px solid gray;
}

.videoPlayer {
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: auto;
  max-height: 100%;
}

.docked .videoPlayer {
  height: 100%;
  width: auto;
}

.overlayControls {
  background-color: #fafafa;
  z-index: 100;
}

.v-btn {
  min-width: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>


