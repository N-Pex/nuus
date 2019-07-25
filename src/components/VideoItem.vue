<template>
  <v-container fluid grid-list-lg pb-1 pt-4 pl-0 pr-0 ma-0>
    <v-layout ref="card" xs12 style="background-color: var(--v-cardBackground-base)">
      <v-flex xs4 mt-0 pt-0 v-if="imageUrl != null">
        <v-img height="65px" max-height="65px" :src="imageUrl" ma-0 pa-0/>
      </v-flex>
      <v-flex @click="itemClicked()" xs7 ml-2 mr-2 mt-0 pt-0>
        <div style="max-height:var(--v-theme-media-title-line-height-scaled-x2);overflow:hidden" :class="{mediaItemTitle: true, selected: isSelected}">
          {{ item.title }}
        </div>
        <div>
            <Date class="itemDate verticalCenter" :date="item.pubDate" ago />
            &nbsp;
            <span class="verticalCenter">
              <v-icon class="ma-0 pa-0" small>$vuetify.icons.typeVideo</v-icon>
            </span>
        </div>
      </v-flex>
      <v-flex xs1 ma-0 pa-0 style="min-width: 70px" class="text-center ma-0 pa-0">
        <v-btn
          medium
          text
          icon
          ma-0
          pa-0
          color="black"
          style="min-width: 0"
          @click="toggleFavorite()"
        >
          <v-icon v-if="isFavorite" class="ma-0 pa-0" color="green">$vuetify.icons.favorite</v-icon>
          <v-icon v-else class="ma-0 pa-0" color="black">$vuetify.icons.favoriteNot</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import db from "../database";
import ItemModel from "../models/itemmodel";
import Date from "./Date";

export default {
  components: {
    Date
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
    imageUrl: null,
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
      this.imageUrl = this.item.imageSrc;

      // If no thumbnail, try generic feed image
      if (this.imageUrl == null) {
        this.imageUrl = this.item.feed.imageUrl;
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