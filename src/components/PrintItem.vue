<template>
        <v-card color="white" flat ma-0 pa-0>        
          <div style="height: var(--v-theme-caption-image-height); display: grid">
            <img
              v-if="hasImage"
              class="white--text image"
              :src="imageSrc"
              style="grid-column: 1; grid-row: 1"
            />
            <div v-else
              style="grid-column: 1; grid-row: 1; background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
            />

            <div
              style="grid-column: 1; grid-row: 1; align-self: end; z-index: 80"
            >
              <v-container fluid class="itemImageTitle ma-4">
              <v-layout align-start>
                <v-flex xs12>
                  <div class="itemTitle ma-2">{{ item.title }}</div>
                </v-flex>
              </v-layout>
              </v-container>
            </div>
          </div>

          <v-container :class="{'noImage': !hasImage}">
            <div v-html="item.description" class="itemDescription mb-4" />
            <div v-html="item.content" class="itemBody" />
          </v-container>
        </v-card>
</template>


<script>
import ItemBase from "./ItemBase";
import Vuetify from "vuetify";
import ItemModel from "../models/itemmodel";

export default {
  name: "PrintItem",
  extends: ItemBase,
  components: {
  },
  data: () => ({
  }),
  methods: {
    onImageError(e) {
      this.$emit("itemLoaded");
    },
    onImageLoad(e) {
      this.$emit("itemLoaded");
    }
  }
};
</script>

<style>
@media print {
  @import url("../assets/item-style.css");
  @import url("../assets/shared-styles.css");  
}
</style>

<style scoped>

.itemImageTitle {
  position: relative;
  font-size: var(--v-theme-title-font-size-scaled);
  left: 0px;
  color: white;
}

.image {
  width: 100%;
  height: var(--v-theme-caption-image-height);
  max-height: 40vh;
  object-fit: cover;
  background-color: aqua;
}

.noImage {
  /* Prevent the content from disappearing under toolbar and share bar! */
  padding-top: 110px;
}
</style>

<style>
div.image-inline,
div.image-inline div {
  display: inline;
}
div.itemBody img {
  width: 120px !important;
  height: 120px !important;
}
.image-inline:nth-of-type(odd) img {
  float: left !important;
  margin-right: 10px;
}
.image-inline:nth-of-type(even) img {
  float: right !important;
  margin-left: 10px;
}
</style>
