<template>
  <div :class="{ 'playerRoot': true, docked: isDocked }" v-on="isDocked ? { click: maximize } : {}">
            <audio
              v-show="false"
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
              <source :src="enclosureURL" :type="enclosureType">Your browser does not support the audio tag.
            </audio>
                <v-container fill-height fluid ma-0 pa-0>
      <v-layout fill-height align-center row ma-0 pa-0>
        <v-flex fill-height ma-0 pa-0 xs12 v-show="!isDocked" class="overlayControls">

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

              <!-- SHARE -->
              <Share style="position:absolute; bottom: 0; left: 0; right: 0" :item="item" />
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
          <div class="text-xs-left dockedTitle">{{ itemTitle }}</div>
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
import Share from './Share.vue';

export default {
  extends: MediaPlayerBase,
  components: {
    Share
  }
};
</script>

<style scoped>
.playerRoot {
  position: fixed;
  left: 0;
  top: 0px;
  right: 0;
  bottom: 66%;
  background-color: #000;
  z-index: 3;
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
  background-color: #fafafa;
  z-index: 100;
}

.v-btn {
  min-width: 0;
  padding: 0;
}

</style>


