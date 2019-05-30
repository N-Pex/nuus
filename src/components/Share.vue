<template>
  <v-container fluid style="background-color: white" ma-0 pa-1>
    <v-layout text-xs-center wrap>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>share</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>play_circle_outline</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>cloud_download</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs3>
                <v-btn
          medium
          flat
          icon
          color="black"
        >
          <v-icon>bookmark_border</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import flavors from "../config";

export default {
  props: {
  },
  mounted: function() {
  },
  data: () => ({
  }),
  methods: {
  }
};
</script>
