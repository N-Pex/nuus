<template>
  <v-container fluid grid-list-lg pb-1 pt-4 pl-0 pr-0 ma-0>
    <v-layout ref="card" xs12 style="background-color: var(--v-cardBackground-base)">
      <v-flex xs4 mt-0 pt-0>
        <v-img aspect-ratio="1.77" max-height="70px" :src="imageUrl" ma-0 pa-0 v-if="imageUrl != null" />
      </v-flex>
      <v-flex @click="itemClicked()" xs7 ml-2 mr-2 mt-0 pt-0>
        <div style="max-height:var(--v-theme-media-title-line-height-scaled-x2);overflow:hidden" :class="{mediaItemTitle: true, selected: isSelected}">
          {{ item.title }}
        </div>
        <div>
            <DateView class="itemDate verticalCenter" :date="item.pubDate" ago />
            &nbsp;
            <span class="verticalCenter">
              <v-icon class="ma-0 pa-0 tiny" small>$vuetify.icons.typeVideo</v-icon>
            </span>
        </div>
      </v-flex>
      <v-flex xs1 ma-0 pa-0 style="min-width: 70px" class="text-center ma-0 pa-0">
        <ItemFavoriteButton :item="item" />
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import DateView from "./DateView";

export default {
  components: {
    DateView
  },
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
    imageUrl: null
  }),
  methods: {
    itemClicked() {
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    },

    updateItem() {
      this.imageUrl = this.item.imageSrc;

      // If no thumbnail, try generic feed image
      if (this.imageUrl == null) {
        this.imageUrl = this.item.feed.imageUrl;
      }
    }
  }
};
</script>

<style scoped>
.selected {
  color: green !important;
}
</style>