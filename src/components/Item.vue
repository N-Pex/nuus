<template>
  <v-container fluid grid-list-lg pb-2 pt-0 pl-0 pr-0 mb-5>
    <v-layout ref="card" xs12 style="background-color: var(--v-cardBackground-base)">
      <v-flex
        xs1
        ma-0
        pa-0
        v-if="playable"
        style="min-width: 70px"
        v-bind:class="{ 'order-lg3': odd, 'order-md3': odd, 'order-sm3': odd, 'order-xs3': odd, 'text-xs-center': true
        , 'ma-0': true, 'pa-0': true }"
      >
        <v-btn
          large
          flat
          icon
          ma-0
          pa-0
          color="black"
          style="min-width: 0"
          @click="playItem()"
        >
          <v-icon large class="ma-0 pa-0">$vuetify.icons.play</v-icon>
        </v-btn>
      </v-flex>
      <v-flex
        xs3
        mt-0
        pt-0
        v-if="imageUrl != null"
        v-bind:class="{ 'order-lg2': odd, 'order-md2': odd, 'order-sm2': odd, 'order-xs2': odd, 'pl-0': odd, 'pr-0': !odd, 'ml-0': odd, 'mr-0': !odd }"
      >
        <div class="imageContainer">
          <v-img aspect-radio="1" :src="imageUrl" class="ma-0 pa-0 image"/>
        </div>
      </v-flex>
      <v-flex
      @click="itemClicked()"
        v-bind:class="'xs'+ (((imageUrl != null) ? 9 : 12) - (playable ? 1 : 0))"
        ml-2
        mr-2
        mt-0
        pt-0
      >
        <div class="itemTitle">{{ item.title }}</div>
        <div class="contentBlock mt-2">
          <div v-html="item.description" class="itemBody" style="max-height:var(--v-theme-body-line-height-scaled-x4);overflow:hidden"/>
        </div>
        <div>
          <span class="itemDate">{{ item.pubDate }}</span>
          &nbsp;
          <span>
            <v-btn
              v-if="item.hasVideoAttachment()"
              flat
              icon
              color="secondary"
              class="ma-0 pa-0"
              style="min-width: 0"
            >
              <v-icon small class="ma-0 pa-0">$vuetify.icons.typeVideo</v-icon>
            </v-btn>
            <v-btn
              v-else-if="item.hasAudioAttachment()"
              flat
              icon
              color="secondary"
              class="ma-0 pa-0"
              style="min-width: 0"
            >
              <v-icon small class="ma-0 pa-0">$vuetify.icons.typeAudio</v-icon>
            </v-btn>
            <v-btn
              v-else
              flat
              icon
              color="secondary"
              class="ma-0 pa-0"
              style="min-width: 0"
            >
              <v-icon small class="ma-0 pa-0">$vuetify.icons.typeText</v-icon>
            </v-btn>
          </span>
        </div>
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
    this.imageUrl = this.item.imageSrc;
    if (this.item.hasVideoAttachment() || this.item.hasAudioAttachment()) {
      this.playable = true;
    }
  },
  data: () => ({
    enclosureURL: "",
    imageUrl: null,
    playable: false
  }),
  methods: {
    playItem() {
      this.$emit("playItem", {
        item: this.item
      });
    },
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
.contentBlock {
  display: block;
}

.contentBlock::after {
  display: block;
  position: relative;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--v-cardBackground-base)
  );
  margin-top: -0.3em;
  height: 0.3em;
  width: 100%;
  content: "";
}

.imageContainer {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  object-fit: cover;
}

/* Special cleanup of the display */
a:empty {
  display: none;
}
br {
  display: none;
}
</style>