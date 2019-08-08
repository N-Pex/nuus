<template>
  <v-container fluid grid-list-sm pb-2 pt-0 pl-0 pr-0 mb-12>
    <v-layout
      ref="card"
      xs12
      style="background-color: var(--v-cardBackground-base)"
      justify-space-between
    >
      <v-flex xs1 ma-0 pa-0 v-if="playable" v-bind:class="playClassObject">
        <div class="text-center">
          <v-btn
            text
            icon
            ma-0
            pa-0
            class="small-button ma-0 pa-0"
            color="black"
            @click="playItem()"
          >
            <v-icon>$vuetify.icons.play</v-icon>
          </v-btn>
        </div>
      </v-flex>
      <v-flex
        grow
        mt-0
        pt-0
        v-if="imageUrl != null"
        v-bind:class="imageClassObject"
        style="width: 30%;max-width: var(--v-theme-title-line-height-scaled-x6);"
      >
        <div class="imageContainer">
          <v-img aspect-radio="1.32" :src="imageUrl" class="ma-0 pa-0 image" />
        </div>
      </v-flex>
      <v-flex @click="itemClicked()" v-bind:class="textClassObject" ml-2 mr-2 mt-0 pt-0>
        <div class="itemTitle">{{ item.title }}</div>
        <div class="contentBlock mt-2">
          <div
            v-html="item.description"
            class="itemBody"
            style="max-height:var(--v-theme-body-line-height-scaled-x4);overflow:hidden"
          />
        </div>
        <div>
          <Date class="itemDate verticalCenter" :date="item.pubDate" ago />&nbsp;
          <span class="verticalCenter">
            <v-icon
              v-if="item.hasVideoAttachment()"
              class="ma-0 pa-0 tiny"
              small
            >$vuetify.icons.typeVideo</v-icon>
            <v-icon
              v-else-if="item.hasAudioAttachment()"
              class="ma-0 pa-0 tiny"
              small
            >$vuetify.icons.typeAudio</v-icon>
            <v-icon v-else class="ma-0 pa-0 tiny" small>$vuetify.icons.typeText</v-icon>
          </span>
        </div>
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
  computed: {
    playClassObject: function() {
      var sort = this.imageUrl == null ? 2 : 3;
      if (this.odd) {
        sort = 1;
      }
      let sortClass = "order-xs" + sort;
      let o = {};
      o[sortClass] = true;
      return o;
    },
    imageClassObject: function() {
      var sort = 1;
      if (this.odd) {
        sort = this.playable ? 3 : 2;
      }
      let sortClass = "order-xs" + sort;
      let o = {};
      o[sortClass] = true;
      return o;
    },
    textClassObject: function() {
      var sort = this.imageUrl == null ? 1 : 2;
      if (this.odd) {
        sort = this.playable ? 2 : 1;
      }
      let sortClass = "order-xs" + sort;
      let o = {};
      o[sortClass] = true;
      return o;
    }
  },
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

<style scoped>
.contentBlock {
  display: block;
}

.imageContainer {
  position: relative;
  width: 100%;
  padding-top: 76%;
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