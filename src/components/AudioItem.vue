<template>
  <v-container fluid grid-list-lg pb-1 pt-4 pl-0 pr-0 ma-0 style="background-color: var(--v-audioCardBackground-base)">
    <v-layout ref="card" xs12>
      <v-flex @click="itemClicked()" xs11 ml-2 mr-2 mt-0 pt-0>
        <div>
            <span class="verticalCenter">
              <v-icon v-if="isSelected" class="selected ma-0 pa-0 tiny" small>$vuetify.icons.typeAudioPlaying</v-icon>
              <v-icon v-else class="ma-0 pa-0 tiny" small>$vuetify.icons.typeAudio</v-icon>
            </span>
            &nbsp;
            <DateView class="itemDate verticalCenter" :date="item.pubDate" ago />
        </div>
        <div style="max-height:var(--v-theme-title-featured-line-height-scaled-x2);overflow:hidden" :class="{mediaItemTitle: true, selected: isSelected}">
          {{ item.title }}
        </div>
        <div style="margin-top:8px;max-height:var(--v-theme-body-line-height-scaled);overflow:hidden" class="mediaItemBody">
          <div v-html="item.description"/>
        </div>
      </v-flex>
      <v-flex xs1 ma-0 pa-0 style="min-width: 70px" class="text-center ma-0 pa-0">
        <ItemFavoriteButton :item="item" class="small-button" />
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import ItemBase from "./ItemBase";
import ItemFavoriteButton from "./ItemFavoriteButton";
import db from "../database";
import ItemModel from "../models/itemmodel";
import DateView from "./DateView";

export default {
  extends: ItemBase,
  components: {
    ItemBase,
    DateView,
    ItemFavoriteButton
  },
  props: {
    isSelected: false
  },
  methods: {
    itemClicked() {
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    }
  }
};
</script>

<style scoped>
.selected {
  color: green !important;
}
</style>