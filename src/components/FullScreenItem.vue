<template>
<v-container fluid ma-0 pa-0 v-scroll:#scroll-target="onScroll">
    <v-layout>
      <v-flex xs12>  
        <v-toolbar flat fixed class="black--text toolbar" :style="cssProps">
      <v-toolbar-side-icon @click="onClose()" class="toolbarIcon" :style="cssProps"><v-icon>arrow_back</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="toolbarTitle">Title</v-toolbar-title>
    </v-toolbar>  
        <v-card color="teal">
<v-img
            class="white--text"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox align-self-end>
                  <span :style="cssProps" class="headline imageTitle">Top 10 Australian beaches</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <Share class="share" />
        <v-container style="height: 1500px;">This is left empty
          <div>{{ offsetTop }}</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
          <div>Div goes here</div>
        </v-container>
    </v-card>
      </v-flex>
    </v-layout>
</v-container>
</template>


<script>
import Share from "../components/Share";
import Vuetify from 'vuetify'

export default {
  name: "FullScreenItem",
    components: {
    Share
  },
  data: () => ({
    offsetTop: 0,
    offsetTopFraction: 1
  }),
  computed: {
    cssProps() {
      return {
        "--v-fade-fraction": this.offsetTopFraction
      };
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onScroll (e) {
      this.offsetTop = e.target.scrollTop;
      this.offsetTopFraction = 1 - this.offsetTop / 200;
    }
  }
};
</script>

<style scoped>
.toolbar {
  height: 50px;
  background-color: rgba(255,255,255, calc(1 - var(--v-fade-fraction)));
}

.toolbarIcon {
  color: rgba(calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),calc(255 * var(--v-fade-fraction)),1);
}

.toolbarTitle {
  opacity: calc(1 - var(--v-fade-fraction));
}

.imageTitle {
  opacity: var(--v-fade-fraction);
}

.share {
  width: 100%;
  height: 50px;
  position: sticky;
  top: 50px;
}

</style>