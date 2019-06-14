<template>
  <v-container fluid grid-list-lg pb-1 pt-3 pl-0 pr-0 ma-0>
    <v-layout ref="card" xs12 style="background-color: var(--v-cardBackground-base)">
      <v-flex @click="itemClicked()" xs11 ml-2 mr-2 mt-0 pt-0>
        <div>
            <span class="verticalCenter">
              <v-icon v-if="isSelected" class="selected ma-0 pa-0" small>$vuetify.icons.typeAudioPlaying</v-icon>
              <v-icon v-else class="ma-0 pa-0" small>$vuetify.icons.typeAudio</v-icon>
            </span>
            &nbsp;
            <span class="itemDate verticalCenter">{{ item.pubDate }}</span>
        </div>
        <div style="max-height:var(--v-theme-title-line-height-scaled-x2);overflow:hidden" :class="{mediaItemTitle: true, selected: isSelected}">
          {{ item.title }}
        </div>
        <div style="margin-top:8px;max-height:var(--v-theme-media-body-line-height-scaled);overflow:hidden" class="mediaItemBody">
          <div v-html="item.description"/>
        </div>
      </v-flex>
      <v-flex xs1 ma-0 pa-0 style="min-width: 70px" class="text-xs-center ma-0 pa-0">
        <v-btn
          medium
          flat
          icon
          ma-0
          pa-0
          color="black"
          style="min-width: 0"
          @click="toggleFavorite()"
        >
          <v-icon v-if="isFavorite" class="ma-0 pa-0">bookmark</v-icon>
          <v-icon v-else class="ma-0 pa-0">bookmark_border</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";

export default {
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    },
    isSelected: false,
    odd: false
  },
  watch: {
    item: function() {
      this.updateItem();
    }
  },
  mounted: function() {
    this.updateItem();
  },
  data: () => ({
    isFavorite: false
  }),
  methods: {
    // Toggle favorite status of item.
    toggleFavorite() {
      const self = this;
      db.items
        .put({ id: this.item.guid, favorite: !this.isFavorite })
        .then(item => {
          self.isFavorite = !self.isFavorite;
        })
        .catch(function() {});
    },
    itemClicked() {
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    },

    updateItem() {
      db.items
        .get(this.item.guid)
        .then(item => (this.isFavorite = item.favorite))
        .catch(function() {});
    }
  }
};
</script>

<style scoped>
.selected {
  color: green !important;
}
</style>