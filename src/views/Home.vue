<template>
  <div class="mainRoot" :style="cssProps">
    <v-app-bar
      flat
      :absolute="useTransparentAppBar"
      :class="{ 'mainListHeader': !useTransparentAppBar, 'transparentAppBar': useTransparentAppBar }"
    >
      <v-app-bar-nav-icon>
        <v-icon color="#1B9739">$vuetify.icons.logo</v-icon>
      </v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title
        :class="{ 'feedTitleWhite': useTransparentAppBar, 'feedTitle': true, 'text-uppercase': true}"
      >{{ $store.state.currentFeedTitle }}</v-toolbar-title>
    </v-app-bar>

    <div
      :class="{'mainItemList': useTransparentAppBar, 'mainItemListMinusAppBar': !useTransparentAppBar, 'ma-0': true}"
      v-on:scroll="onHeaderScroll"
      ref="mainItemList"
    >
      <!-- IF headerTags prop is set, show a header -->
      <div
        v-if="headerType != null"
        class="mainListHeader mainItemListHeaderTop pa-5 pt-8 headerTitle"
      >{{ headerTitle }}</div>
      <div
        v-if="headerType != null"
        class="mainListHeader pl-5 pr-5 pt-2 pb-2"
        style="position: sticky; top: 0px; z-index: 5;"
      >
        <v-chip-group v-if="headerType == 'saved'" active-class="selectedTag" mandatory>
          <v-chip
            active-class="selectedTag"
            class="text-uppercase"
            color="transparent"
            text-color="black"
            label
            v-for="tag in headerTagsSaved"
            :key="tag.value"
            @click="onHeaderTag(tag)"
          >{{ tag.name }}</v-chip>
        </v-chip-group>

        <v-chip-group
          v-else-if="headerType == 'categories' && headerTagsCategories.length == 0"
          active-class="selectedTag"
          mandatory
          show-arrows
        >
          <!-- No categories loaded, just insert a hidden placeholder here -->
          <v-chip
            active-class="selectedTag"
            class="text-uppercase"
            color="transparent"
            text-color="black"
            label
            style="display: none"
          >{{ "No categories" }}</v-chip>
        </v-chip-group>

        <v-chip-group
          v-else-if="headerType == 'categories'"
          active-class="selectedTag"
          mandatory
          show-arrows
          v-model="selectedTag"
        >
          <v-chip
            active-class="selectedTag"
            class="text-uppercase"
            color="transparent"
            text-color="black"
            label
            v-for="tag in headerTagsCategories"
            :key="tag.value"
          >{{ tag.name }}</v-chip>
        </v-chip-group>
      </div>
      <div v-if="headerType != null" class="mainListHeader mainItemListHeaderBottom" />
      <!-- End of header -->

      <!-- If empty saved tab -->
      <v-container
        v-if="currentHeaderTag != null && currentHeaderTag.value.startsWith('saved_') && filteredItems.length == 0"
        fluid
      >
        <v-layout fill-height justify-center align-center>
          <v-flex>
            <div class="text-center">
              <v-icon
                class="ma-5 pa-0"
                style="width: 64px; height: 64px"
                color="green"
              >$vuetify.icons.favorites</v-icon>
            </div>
            <div class="text-center">When you save stories and media, they will appear here.</div>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- If empty categories tab -->
      <v-container
        v-else-if="headerType == 'categories' && headerTagsCategories.length == 0"
        fluid
      >
        <v-layout fill-height justify-center align-center>
          <v-flex>
            <div class="text-center">
              <v-icon
                class="ma-5 pa-0"
                style="width: 64px; height: 64px"
                color="green"
              >$vuetify.icons.favorites</v-icon>
            </div>
            <div class="text-center">No categories loaded.</div>
          </v-flex>
        </v-layout>
      </v-container>

      <ItemListPlain
        v-else-if="currentHeaderTag != null"
        v-bind:items="filteredItems"
        v-on:itemClicked="itemClicked($event)"
        v-on:playItem="playItem($event)"
        v-on:playStarted="onPlayStarted($event)"
        class="pt-0 ma-0"
        :showFavorites="currentHeaderTag != null && currentHeaderTag.value.startsWith('saved_')"
      />
      <ItemList
        v-else
        v-bind:items="filteredItems"
        v-on:itemClicked="itemClicked($event)"
        v-on:playItem="playItem($event)"
        v-on:playStarted="onPlayStarted($event)"
        class="pt-0 ma-0"
        :plain="currentHeaderTag != null"
      />
    </div>

    <div class="videoItemList">
      <!-- Video player, current item info (including share) and a list of videos -->
      <VideoPlayer
        ref="videoPlayer"
        :isDocked="this.$root.mediaPlayerDocked"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer == this.$refs.videoPlayer && !this.$root.mediaPlayerInvisible"
      />

      <v-container
        class="videoListCurrentItem"
        fluid
        grid-list-sm
        pa-0
        ma-0
        v-if="showMediaList && playingMediaItem != null && playingMediaItem.hasVideoAttachment()"
      >
        <v-layout xs12>
          <v-flex xs12 ml-2 mr-2 mt-0 pt-0>
            <div>
              <DateView class="itemDate verticalCenter" :date="playingMediaItem.pubDate" />
            </div>
            <div
              class="mediaItemTitle"
              style="max-height:var(--v-theme-title-line-height-scaled-x2);overflow:hidden"
            >{{ playingMediaItem.title }}</div>
            <div class="contentBlock mt-2">
              <div
                v-html="playingMediaItem.description"
                class="mediaItemBody"
                style="max-height:var(--v-theme-body-line-height-scaled-x2);overflow:hidden"
              />
            </div>
            <Share :item="playingMediaItem" />
          </v-flex>
        </v-layout>
      </v-container>
      <ItemListVideo
        :items="filteredItems | videoItems"
        v-if="showMediaList && playingMediaItem != null && playingMediaItem.hasVideoAttachment()"
        :selectedItem="playingMediaItem"
        v-on:playItem="playItemFromMediaList($event)"
        v-on:itemClicked="playItemFromMediaList($event)"
        class="videoList"
      />
    </div>

    <div class="audioItemList">
      <AudioPlayer
        ref="audioPlayer"
        :isDocked="this.$root.mediaPlayerDocked"
        v-on:close="onClose()"
        v-on:minimize="onMinimize()"
        v-on:maximize="onMaximize()"
        v-on:openFullscreen="itemClicked($event)"
        v-show="this.$root.mediaPlayer != null && this.$root.mediaPlayer == this.$refs.audioPlayer && !this.$root.mediaPlayerInvisible"
      />

      <ItemListAudio
        :items="filteredItems | audioItems"
        v-if="showMediaList && playingMediaItem != null && playingMediaItem.hasAudioAttachment()"
        :selectedItem="playingMediaItem"
        v-on:playItem="playItemFromMediaList($event)"
        v-on:itemClicked="playItemFromMediaList($event)"
        class="audioList"
      />
    </div>

    <div
      v-if="fullScreenItem != null && this.$route.query.fullscreen !== undefined"
      class="fullScreenItem ma-0 pa-0"
      id="scroll-target"
    >
      <FullScreenItem v-on:close="onCloseFullscreen()" :item="fullScreenItem" />
    </div>
  </div>
</template>

<script>
import ItemList from "../components/ItemList";
import ItemListPlain from "../components/ItemListPlain";
import ItemListAudio from "../components/ItemListAudio";
import ItemListVideo from "../components/ItemListVideo";
import Item from "../components/Item";
import ItemModel from "../models/itemmodel";
import VideoPlayer from "../components/VideoPlayer";
import AudioPlayer from "../components/AudioPlayer";
import Share from "../components/Share";
import FullScreenItem from "../components/FullScreenItem";
import DateView from "../components/DateView";

//import axios from "axios";
//import sanitizeHTML from "sanitize-html";
import db from "../database";
//import rssparser from "../services/rssparser";
//import velocity from "velocity-animate";
import flavors from "../config";
import router from "../router";
import moment from "moment";

export default {
  name: "Home",
  components: {
    ItemList,
    ItemListPlain,
    ItemListAudio,
    ItemListVideo,
    Item,
    VideoPlayer,
    AudioPlayer,
    Share,
    FullScreenItem,
    DateView
  },
  props: {
    headerTitle: null,
    headerType: null
  },
  methods: {
    itemClicked(eventInfo) {
      console.log(
        "Item clicked " + eventInfo.item.title + " at rect " + eventInfo.rect
      );
      this.fullScreenItem = eventInfo.item;
      this.$router.push("?fullscreen");
    },

    setMediaPlayer(mediaPlayer) {
      if (this.$root.mediaPlayer != null) {
        this.$root.mediaPlayer.item = null;
      }
      console.log(mediaPlayer);
      this.$root.mediaPlayer = mediaPlayer;
      this.$root.mediaPlayerInvisible = false;
    },

    playItem(eventInfo) {
      console.log("Play item " + eventInfo.item.title);
      if (eventInfo.item.hasVideoAttachment()) {
        this.$root.mediaPlayerDocked = false;
        this.setMediaPlayer(this.$refs.videoPlayer);
        this.showMediaList = true;
      } else {
        // Audio player. Start docked (so dont show the media list).
        this.$root.mediaPlayerDocked = true;
        this.setMediaPlayer(this.$refs.audioPlayer);
        this.showMediaList = false;
      }
      this.$root.mediaPlayerHidden = false;
      this.$root.mediaPlayer.load(eventInfo.item, true);
      this.playingMediaItem = eventInfo.item;
    },

    playItemFromMediaList(eventInfo) {
      this.$root.mediaPlayer.load(eventInfo.item, true);
      this.playingMediaItem = eventInfo.item;
    },

    onPlayStarted(item) {
      console.log("On play started:");
      console.log(item);
      this.playingMediaItem = item;
      if (item.hasVideoAttachment()) {
        this.showMediaList = true;
      } else {
        this.showMediaList = false;
      }
    },

    onClose() {
      this.showMediaList = false;
      this.setMediaPlayer(null);
    },

    onMinimize() {
      this.$root.mediaPlayerDocked = true;
      this.showMediaList = false;
    },

    onMaximize() {
      this.$root.mediaPlayerDocked = false;
      if (this.$root.mediaPlayer != null) {
        this.showMediaList = true;
      }
    },

    showOnboarding() {
      router.push({ name: "onboarding" });
    },

    onCloseFullscreen() {
      console.log("onCloseFullscreen()");
      this.fullScreenItem = null;
      this.$root.mediaPlayerDocked = true;
      this.$root.mediaPlayerInvisible = false;
      this.$router.go(-1);
    },

    onHeaderScroll(e) {
      let offsetTop = e.target.scrollTop;
      this.headerScrollFraction = Math.min(
        1,
        Math.max(0, 1 - offsetTop / 120)
      ).toFixed(2);
    },

    onHeaderTag(tag) {
      this.currentHeaderTag = tag;
    },

    updateHeader() {
      if (this.headerType == "saved") {
        this.currentHeaderTag = this.headerTagsSaved[0];
      } else if (this.headerType == "categories") {
        this.currentHeaderTag = this.headerTagsCategories[0];
      } else {
        this.currentHeaderTag = null;
      }
    },

    scrollToTop() {
      //TODO - call this onShow or similar, when tab is changed
      this.$refs.mainItemList.scrollTop = 0;
    },

    updateFilteredItems() {
      if (this.$store.state.currentFeedItems == null) {
        this.filteredItems = [];
      } else if (
        this.currentHeaderTag != null &&
        this.currentHeaderTag.value.startsWith("saved_")
      ) {
        const self = this;
        db.items.toArray().then(items => {
          self.filteredItems = self.sortItemsOnPubDate(
            items
              .map(function itemObject(item) {
                return ItemModel.fromString(item.item);
              })
              .filter(function(i) {
                return i.savedByUser != null;
              })
              .filter(function(i) {
                var saveDate = new Date(parseInt(i.savedByUser, 10));
                if (self.currentHeaderTag.value == "saved_week") {
                  return moment()
                    .subtract(7, "days")
                    .isBefore(saveDate);
                } else if (self.currentHeaderTag.value == "saved_month") {
                  return moment()
                    .subtract(1, "months")
                    .isBefore(saveDate);
                }
                return true;
              })
          );
        });
      } else if (
        this.currentHeaderTag != null &&
        this.currentHeaderTag.value.startsWith("cat_")
      ) {
          var index = parseInt(this.currentHeaderTag.value.substr(4), 10);
          var cat = this.$store.state.currentFeedCategories[index];
          this.filteredItems = this.sortItemsOnPubDate(cat.items);
      } else {
        this.filteredItems = this.sortItemsOnPubDate(
          this.$store.state.currentFeedItems.filter(function(i) {
            return true;
          })
        );
      }
    },
    sortItemsOnPubDate(items) {
      return items.sort(function(a, b) {
        if (a.pubDate == null) {
          return 1;
        } else if (b.pubDate == null) {
          return -1;
        }
        return moment(a.pubDate).isBefore(b.pubDate) ? 1 : -1;
      });
    },

    enableDisableScrolling() {
      document
        .querySelector("html")
        .classList.toggle(
          "application--dialog-opened",
          this.fullScreenItem != null || this.showMediaList
        );
    }
  },

  filters: {
    videoItems(items) {
      return items.filter(function(i) {
        return i.hasVideoAttachment();
      });
    },
    audioItems(items) {
      return items.filter(function(i) {
        return i.hasAudioAttachment();
      });
    }
  },

  watch: {
    headerType: function() {
      console.log("Header type changed to " + this.headerType);
      this.updateHeader();
    },
    currentHeaderTag: function() {
      console.log("Filter items");
      this.updateFilteredItems();
    },
    showMediaList: function() {
      this.enableDisableScrolling();
    },

    fullScreenItem: function() {
      this.enableDisableScrolling();
    }
  },

  created() {
    this.$root.$on("favChanged", () => {
      if (
        this.currentHeaderTag != null &&
        this.currentHeaderTag.value.startsWith("saved_")
      ) {
        this.updateFilteredItems();
      }
    });
  },

  beforeDestroy() {
    console.log("BeforeDestroyed");
    this.$root.$off("favChanged");
  },

  destroyed() {
    if (this.storeWatchObject != null) {
      console.log("Home destroyed, stop listening");
      this.storeWatchObject();
      this.storeWatchObject = null;
    }
  },

  mounted() {
    console.log("Home mounted, start listening!");
    this.storeWatchObject = this.$store.watch(
      state => state.currentFeedItems,
      (oldValue, newValue) => {
        console.log("Items string is changing");
        this.updateFilteredItems();
      }
    );

    // Store the audio player instance.
    this.$root.audioPlayer = this.$refs.audioPlayer;
    this.$root.videoPlayer = this.$refs.videoPlayer;
    this.updateFilteredItems();
    this.updateHeader();
  },

  data() {
    return {
      showMediaList: false,
      playingMediaItem: null,
      filteredItems: [],
      headerTagsSaved: [
        { name: "All", value: "saved_all" },
        { name: "This week", value: "saved_week" },
        { name: "This month", value: "saved_month" }
      ],
      headerScrollFraction: 1,
      currentHeaderTag: null,
      fullScreenItem: null
    };
  },
  computed: {
    cssProps() {
      return {
        "--v-header-scroll-fraction": this.headerScrollFraction
      };
    },
    useTransparentAppBar() {
      return this.headerType == null;
    },
    headerTagsCategories() {
      var cats = [];
      for (var i = 0; i < this.$store.state.currentFeedCategories.length; i++) {
        let cat = this.$store.state.currentFeedCategories[i];
        cats.push({ name: cat.category, value: "cat_" + i });
      }
      return cats;
    },
    selectedTag: {
      get: function () {
        if (this.currentHeaderTag != null) {
          if (this.headerType == "saved") {
            return this.headerTagsSaved.indexOf(this.currentHeaderTag);
          }
          return this.headerTagsCategories.indexOf(this.currentHeaderTag);
        }
        return 0;
      },
      set: function (val) {
          if (this.headerType == "saved") {
            this.currentHeaderTag = this.headerTagsSaved[val];
          } else {
            this.currentHeaderTag = this.headerTagsCategories[val];
          }
      }
    }
  }
};
</script>

<style scoped>
@import url("../assets/css/item-style.css");
@import url("../assets/css/shared-styles.css");
</style>

<style>
.application--dialog-opened {
  overflow: hidden;
}

.transparentAppBar {
  background-color: rgba(
    255,
    255,
    255,
    calc(1 - var(--v-header-scroll-fraction))
  ) !important;
}

.mainRoot {
  width: 100%;
  height: 100%;
  overflow-y: none;
}

.mainItemList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.mainItemListMinusAppBar {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.audioItemList {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  z-index: 15;
}

.videoItemList {
  z-index: 15;
}

.videoListCurrentItem {
  background-color: #ffffff;
  position: absolute;
  top: 25%;
  bottom: 57%;
  right: 0;
  left: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  z-index: 15;
}

.videoList {
  background-color: #ffffff;
  position: absolute;
  top: 43%;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}

.audioList {
  background-color: #ffffff;
  position: absolute;
  top: 34%;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}

.feedTitleWhite {
  color: rgba(
    calc(255 * var(--v-header-scroll-fraction)),
    calc(255 * var(--v-header-scroll-fraction)),
    calc(255 * var(--v-header-scroll-fraction)),
    1
  ) !important;
  text-decoration: underline
    rgba(
      calc(255 * var(--v-header-scroll-fraction)),
      calc(255 * var(--v-header-scroll-fraction)),
      calc(255 * var(--v-header-scroll-fraction)),
      1
    )
    solid;
}

.mainListHeader {
  /* ADDAB8 */
  /*background-color: rgba(173, 218, 184, var(--v-header-scroll-fraction));*/
  background-color: rgba(
    calc(255 - 82 * var(--v-header-scroll-fraction)),
    calc(255 - 38 * var(--v-header-scroll-fraction)),
    calc(255 - 71 * var(--v-header-scroll-fraction)),
    1
  ) !important;
}

.mainItemListHeaderTop {
  height: 80px;
}

.mainItemListHeaderBottom {
  position: sticky;
  top: 0px;
  height: 20px;
  border-bottom-left-radius: 20px;
}

.v-chip.selectedTag {
  background-color: green !important;
  color: white !important;
}

.fullScreenItem {
  background-color: white;
  z-index: 20;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>