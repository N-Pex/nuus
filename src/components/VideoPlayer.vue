<template>
  <div :class="{ 'playerRoot': true, docked: isDocked }" v-on="isDocked ? { click: maximize } : {}">
    <v-container fill-height fluid ma-0 pa-0>
      <v-layout fill-height align-center row ma-0 pa-0>
        <v-flex fill-height ma-0 pa-0 :class="'xs'+ (isDocked ? 3 : 12)" style="display: grid">
          <div style="grid-column: 1; grid-row: 1">
            <!-- VIDEO PLAYER -->
            <video
              class="player"
              ref="player"
              @click="showHideOverlayControls"
              @canplay="onCanPlay"
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
              v-show="showOverlayControls"
            >
              <!-- TOP PART - MINIMIZE AND CLOSE BUTTONS -->
              <v-btn
                text
                icon
                color="white"
                @click="minimize()"
                class="ma-2 pa-0"
                style="position: absolute; left: 0; top: 0"
              >
                <v-icon medium>$vuetify.icons.collapse</v-icon>
              </v-btn>
              <v-btn
                text
                icon
                color="white"
                @click="close()"
                class="ma-2 pa-0"
                style="position: absolute; right: 0; top: 0"
              >
                <v-icon medium>$vuetify.icons.close</v-icon>
              </v-btn>

              <!-- MIDDLE PART - REPLAY, PLAY AND SKIP -->
              <v-container fluid fill-height pa-0 ma-0>
                <v-layout align-center justify-center row pa-0 ma-0>
                  <v-flex xs2 class="text-center">
                    <v-btn text icon color="white" @click="replay10()" class="ma-2 pa-0 small-button">
                      <v-icon>$vuetify.icons.replay10</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-center">
                    <v-btn
                      v-show="!isPlaying"
                      text
                      icon
                      color="white"
                      @click="play()"
                      class="ma-2 pa-0 large-button"
                    >
                      <v-icon>$vuetify.icons.play</v-icon>
                    </v-btn>
                    <v-btn
                      v-show="isPlaying"
                      text
                      icon
                      color="white"
                      @click="pause()"
                      class="ma-2 pa-0 large-button"
                    >
                      <v-icon>$vuetify.icons.pause</v-icon>
                    </v-btn>
                  </v-flex>

                  <v-flex xs2 class="text-center">
                    <v-btn text icon color="white" @click="forward10()" class="ma-2 pa-0 small-button">
                      <v-icon>$vuetify.icons.forward10</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- BOTTOM PART - PROGRESS -->
              <v-slider
                  height="4px"
                  hide-details
                  color="green lighten-1"
                  class="progress ma-0 pa-0"
                  background-color="green lighten-5"
                  style="background-color:transparent;position: absolute; bottom: 0; left: 0; right: 0"
                  :value="currentPlayPercentage"
                  v-on:change="seekToPercentage($event)"
                  v-on:start="draggingSlider = true; enableOverlayControlsTimeout(false)"
                  v-on:end="draggingSlider = false; enableOverlayControlsTimeout(true)"
                />
            </div>
          </transition>
        </v-flex>
        <v-flex xs7 v-show="isDocked" fill-height @click="maximize()" class="text-center">
          <v-btn
            class="ma-0 pa-0"
            text
            small
            icon
            color="black"
            @click="maximize()"
            style="min-width: 0;min-height: 0; position:relative;top:0px">
            <v-icon>$vuetify.icons.expand</v-icon>
          </v-btn>
          <div class="text-left dockedTitle">{{ itemTitle }}</div>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-center">
          <v-btn v-show="!isPlaying" text medium icon color="black" @click="play()">
            <v-icon>$vuetify.icons.play</v-icon>
          </v-btn>
          <v-btn v-show="isPlaying" text medium icon color="black" @click="pause()">
            <v-icon>$vuetify.icons.pause</v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs1 v-show="isDocked" class="text-center mr-4">
          <v-btn text medium icon color="black" @click="close()">
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
  extends: MediaPlayerBase,
  data: () => ({
    draggingSlider: false
  }),
};
</script>

<style scoped>
.playerRoot {
  position: fixed;
  left: 0;
  top: 0px;
  right: 0;
  bottom: 75%;
  background-color: #000;
  z-index: 20;
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

.player {
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: auto;
  max-height: 100%;
}

.docked .player {
  height: 100%;
  width: auto;
}

.overlayControls {
  background-color: rgba(0, 0, 0, 0.4);
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