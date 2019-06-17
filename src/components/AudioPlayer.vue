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
      v-on="draggingSlider ? {} : { timeupdate: onTimeUpdate }"
    >
      <source :src="enclosureURL" :type="enclosureType">Your browser does not support the audio tag.
    </audio>
    <v-container fluid fill-height ma-0 pa-0>
      <v-layout column ma-0 pa-0 xs12>
        <!-- MINIMIZE AND CLOSE BUTTONS -->
        <v-flex ma-0 pa-0 pt-3 pb-3 xs2 v-show="!isDocked" class="overlayControls">
          <v-btn
            flat
            icon
            color="black"
            @click="minimize()"
            ma-2
            pa-0
            class="tiny-button"
            style="position: absolute; left: 0; top: 0"
          >
            <v-icon>$vuetify.icons.collapse</v-icon>
          </v-btn>
          <v-btn
            flat
            icon
            color="black"
            @click="close()"
            ma2-
            pa-0
            class="tiny-button"
            style="position: absolute; right: 0; top: 0"
          >
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>

        <!-- ITEM IMAGE AND TEXT -->
        <v-flex ma-0 pa-0 pl-2 pr-2 xs4 v-show="!isDocked" class="overlayControls">
          <v-container fluid grid-list-sm pa-0 ma-0>
            <v-layout xs12>
              <v-flex xs3 ml-2 pt-0 v-if="imageUrl != null">
                <div class="imageContainer">
                  <v-img aspect-radio="1" :src="imageUrl" class="ma-0 pa-0 image"/>
                </div>
              </v-flex>
              <v-flex
                @click="itemClicked()"
                v-bind:class="'xs'+ ((imageUrl != null) ? 9 : 12)"
                ml-2
                mr-2
                mt-0
                pt-0
              >
                <div>
                  <Date class="itemDate verticalCenter" :date="item.pubDate" />
                </div>
                <div class="mediaItemTitle" style="max-height:var(--v-theme-media-title-line-height-scaled-x2);overflow:hidden">{{ item.title }}</div>
                <div class="contentBlock mt-2">
                  <div
                    v-html="item.description"
                    class="mediaItemBody"
                    style="max-height:var(--v-theme-media-body-line-height-scaled-x2);overflow:hidden"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

        <!-- REPLAY, PLAY AND SKIP -->
        <v-flex ma-0 pa-0 pl-2 pr-2 xs3 v-show="!isDocked" shrink class="overlayControls">
          <v-container fluid fill-height pa-0 ma-0>
            <v-layout align-center justify-center row pa-0 ma-0>
              <v-flex xs2 class="text-xs-center">
                <v-btn flat icon color="black" @click="replay10()" class="ma-2 pa-0 small-button">
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
                <v-btn flat icon color="black" @click="forward10()" class="ma-2 pa-0 small-button">
                  <v-icon>$vuetify.icons.forward10</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

        <!-- SLIDER -->
        <v-flex ma-0 pa-0 pl-2 pr-2 xs2 v-show="!isDocked" shrink class="overlayControls">
          <v-container fluid fill-height pa-0 ma-0>
            <v-layout align-center justify-center row pa-0 ma-0>
              <v-flex xs2 class="text-xs-center">
                <div class="durationText">{{ currentPlaySeconds | timeInColonFormat }}</div>
              </v-flex>
              <v-flex xs8 class="text-xs-center">
                <v-slider
                  height="4px"
                  hide-details
                  color="green lighten-1"
                  class="progress ma-2 pa-0"
                  background-color="green lighten-5"
                  :value="currentPlayPercentage"
                  v-on:change="seekToPercentage($event)"
                  v-on:start="draggingSlider = true"
                  v-on:end="draggingSlider = false"
                />
              </v-flex>
              <v-flex xs2 class="text-xs-center">
                <div class="durationText">{{ duration | timeInColonFormat }}</div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

        <!-- SHARE -->
        <v-flex ma-0 pa-0 xs1 v-show="!isDocked" shrink class="overlayControls">
          <Share :item="item" style="background-color:white"/>
        </v-flex>

        <v-flex ma-0 pa-0 xs12 v-show="isDocked" class="overlayControls">
          <v-container fluid fill-height pa-0 ma-0>
            <v-layout align-center justify-center row pa-0 ma-0>
              <v-flex
                xs10
                v-show="isDocked"
                fill-height
                @click="maximize()"
                class="ml-3 text-xs-center"
              >
                <v-btn
                  class="ma-0 pa-0"
                  flat
                  small
                  icon
                  color="black"
                  @click="maximize()"
                  style="min-width: 0;min-height: 0; position:relative;top:0px"
                >
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
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import MediaPlayerBase from "./MediaPlayerBase.vue";
import Share from "./Share.vue";
import Date from "./Date";

export default {
  extends: MediaPlayerBase,
  components: {
    Share, Date
  },
  data: () => ({
    draggingSlider: false
  }),
  methods: {
    itemClicked() {
      this.$emit("openFullscreen", { item: this.item, rect: null });
    }
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
  background-color: #ffffff;
  z-index: 100;
}

.v-btn {
  min-width: 0;
  padding: 0;
}

.image {
  width: 65px;
  height: 65px;
  object-fit: cover;
}

.durationText {
  color: var(--v-secondary-base);
  font-family: var(--v-theme-body-font);
  font-size: var(--v-theme-body-font-size);
  line-height: var(--v-theme-body-line-height);
}
</style>


