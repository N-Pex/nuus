<template>
  <v-container fluid grid-list-lg pa-2>
    <v-layout row wrap>
      <v-flex ref="card" xs12>
        <v-card color="cardBackground" class="black--text" @click="itemClicked()">
          <v-layout ma-0>
            <v-flex
              xs4
              ma-1
              v-if="imageUrl != null"
              v-bind:class="{ 'order-lg2': odd, 'order-md2': odd, 'order-sm2': odd, 'order-xs2': odd }"
            >
              <v-img
                :src="imageUrl"
                width="100%"
                class="ma-1"
                contain
              ></v-img>
            </v-flex>
            <v-flex v-bind:class="'xs'+ ((imageUrl != null) ? '8' : '12')">
              <v-card-title primary-title class="pa-1">
                <div class="contentBlock">
                  <div class="headline">{{ item.title }}</div>
                  <div v-html="item.pubDate" class="date"/>
                  <div
                    v-html="item.description"
                    class="body"
                    style="max-height:100px;overflow:hidden"
                  />
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
                <v-btn v-if="item.hasVideoEnclosure()" flat icon color="black" class="ma-0 pa-0" style="min-width: 0">
                  <v-icon small class="ma-0 pa-0">videocam</v-icon>
                </v-btn>
                <v-btn v-if="item.hasAudioEnclosure()" flat icon color="black" class="ma-0 pa-0" style="min-width: 0">
                  <v-icon small class="ma-0 pa-0">audiotrack</v-icon>
                </v-btn>
            Rate this album
            <v-spacer></v-spacer>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
            <v-icon>star_border</v-icon>
          </v-card-actions>
        </v-card>
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
    odd: false
  },

  mounted: function() {
    var self = this;
    if (Math.random() > 0.5) {
      this.imageUrl = this.item.imageSrc;
    }
  },
  data: () => ({
    enclosureURL: "",
    imageUrl: null
  }),
  methods: {
    itemClicked() {
      console.log("Item " + this.$refs.card.getBoundingClientRect());
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    },

    readMore() {
      console.log("Item " + this.$refs.card.getBoundingClientRect());
      this.$emit("itemClicked", {
        item: this.item,
        rect: this.$refs.card.getBoundingClientRect()
      });
    }
  }
};
</script>

<style>
.contentBlock::after {
  display: block;
  position: relative;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--v-cardBackground-base)
  );
  margin-top: -20px;
  height: 20px;
  width: 100%;
  content: "";
}

/* Special cleanup of the display */
a:empty {
  display: none;
}
br {
  display: none;
}
</style>