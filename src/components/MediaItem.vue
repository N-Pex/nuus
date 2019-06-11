<template>
  <v-container fluid grid-list-lg pb-2 pt-0 pl-0 pr-0 mb-3>
    <v-layout ref="card" xs12 style="background-color: var(--v-cardBackground-base)">
      <v-flex xs4 mt-0 pt-0 v-if="!isAudio && imageUrl != null">
        <v-img height="65px" max-height="65px" :src="imageUrl" ma-0 pa-0/>
      </v-flex>
      <v-flex @click="itemClicked()" v-bind:class="'xs'+ (isAudio ? 10 : 7)" ml-2 mr-2 mt-0 pt-0>
        <div style="max-height:34px;overflow:hidden">
          <h3 :class="{selected: isSelected}">{{ item.title }}</h3>
        </div>
        <div v-if="isAudio" style="max-height:9px;overflow:hidden" class="mediaDescription">
          <div v-html="item.description"/>
        </div>

        <div>
          <span class="date">{{ item.pubDate }}</span>
          &nbsp;
          <span>
              <v-icon v-if="isAudio" small class="ma-0 pa-0">$vuetify.icons.typeAudio</v-icon>
              <v-icon v-else small class="ma-0 pa-0">$vuetify.icons.typeVideo</v-icon>
          </span>
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
    imageUrl: null,
    isFavorite: false,
    isAudio: false
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
      console.log("Item has been set!");
      this.imageUrl = this.item.imageSrc;

      // If no thumbnail, try generic feed image
      if (this.imageUrl == null) {
        this.imageUrl = this.item.feed.imageUrl;
      }
      if (this.item.hasAudioAttachment()) {
        this.isAudio = true;
      } else {
        this.isAudio = false;
      }
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