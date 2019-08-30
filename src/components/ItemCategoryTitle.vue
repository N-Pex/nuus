<template>
  <v-img
    :src="imageSrc"
    class="ma-0 pa-0 imageContainer"
    lazy-src="invalid.png"
    gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,1)"
  >
    <v-layout ref="card" fill-height justify-space-between align-end pa-2>
      <v-flex grow mt-0 pt-0 v-if="playable">
        <PlayButton
          :item="item"
          playerColor="white"
          showMediaPlayer
          class="playButton"
          v-on:playStarted="onPlayStarted($event)"
        />
      </v-flex>

      <v-flex>
        <div class="itemCategory text-uppercase">{{ item.category }}</div>
        <div @click="itemClicked()" ml-2 mr-2 mt-0 pt-0>
          <div class="itemTitle">{{ item.title }}</div>
          <div class="contentBlock mt-2">
            <div
              v-html="item.description"
              class="itemBody"
              style="max-height:var(--v-theme-body-line-height-scaled-x4);overflow:hidden"
            />
          </div>
          <div>
            <DateView class="itemDate verticalCenter" :date="item.pubDate" ago />&nbsp;
            <ItemType :item="item" color="white" />
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-img>
</template>


<script>
import ItemBase from "./ItemBase";
import ItemType from "./ItemType";
import DateView from "./DateView";
import PlayButton from "./PlayButton";

export default {
  extends: ItemBase,
  components: {
    DateView,
    PlayButton,
    ItemType
  }
};
</script>

<style scoped>
.itemTitle,
.itemBody,
.itemDate,
.tiny {
  color: white !important;
}

.itemCategory {
  height: 30px;
  color: white;
}

.playButton {
  margin-top: 30px;
}

.contentBlock {
  display: block;
}

.imageContainer {
  width: 100%;
  height: 200px;
  background-color: white;
}
</style>