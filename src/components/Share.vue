<template>
  <v-container fluid ma-0 pa-1>
    <v-layout text-center wrap justify-center align-center>
      <v-flex xs3>
        <v-btn class="medium-button" icon color="black" @click="share">
          <v-icon>$vuetify.icons.share</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn class="medium-button" icon color="black">
          <v-icon>$vuetify.icons.facebook</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn class="medium-button" icon color="black" @click="download">
          <v-icon>$vuetify.icons.download</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
        <ItemFavoriteButton class="ma-0 pa-0 medium-button" :item="item" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ItemModel from "../models/itemmodel";
import ItemFavoriteButton from "./ItemFavoriteButton";

export default {
  components: {
    ItemFavoriteButton
  },
  props: {
    item: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },
  methods: {
    share() {
      this.$root.appInstance.componentInstance.shareItem(this.item);
    },
    download() {
      this.$root.appInstance.componentInstance.printItem(this.item);
    }
  }
};

</script>
