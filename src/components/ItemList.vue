<template>
  <div class="ma-0 pa-0" ref="container">
      <v-list v-if="listType == 'video'" ref="list">
        <VideoItem
          v-for="(item, index) in items"
          :key="item.guid"
          :ref="item.guid"
          class="ma-0"
          :item="item"
          :isSelected="item == selectedItem"
          :odd="index % 2 != 0"
          v-on:itemClicked="playItem($event)"
          v-on:playItem="playItem($event)"
        />
      </v-list>
      <v-list v-else-if="listType == 'audio'" ref="list">
        <div v-for="(item, index) in items" :key="item.guid" style="background-color: var(--v-audioCardBackground-base)">
          <AudioItem
            :ref="item.guid"
            class="ma-0"
            :item="item"
            :isSelected="item == selectedItem"
            :odd="index % 2 != 0"
            v-on:itemClicked="playItem($event)"
            v-on:playItem="playItem($event)"
          />
          <!-- If not last item, add a divider between items -->
          <div v-if="index < items.length - 1" class="listDivider"/>
        </div>
      </v-list>
      <v-list v-else ref="list">
    <v-container fluid grid-list-sm>
    <v-layout
      xs12
      row
      wrap
      justify-space-between
    >
        <v-flex v-bind:class="{'xs6': index % 5 == 0 || index % 5 == 1, 'xs12': index % 5 != 0 && index % 5 != 1}" v-for="(item, index) in items" :key="item.guid">
        <ItemNew
          :ref="item.guid"
          class="ma-0"
          :item="item"
          :odd="index % 2 != 0 && index % 5 != 0 && index % 5 != 1"
          v-on:itemClicked="itemClicked($event)"
          v-on:playItem="playItem($event)"
          v-on:playStarted="onPlayStarted($event)"
        />
        </v-flex>
    </v-layout>
    </v-container>
      </v-list>
      </div>
</template>


<script>
import Item from "./Item";
import ItemNew from "./ItemNew";
import AudioItem from "./AudioItem";
import VideoItem from "./VideoItem";
import ItemModel from "../models/itemmodel";

export default {
  components: {
    Item,
    ItemNew,
    AudioItem,
    VideoItem,
    ItemModel
  },
  props: {
    listType: {
      type: String,
      default: function() {
        return "none";
      }
    },
    items: {
      type: Array,
      // Object or array defaults must be returned from
      // a factory function
      default: function() {
        return [];
      }
    },
    selectedItem: {
      type: ItemModel,
      default: function() {
        return new ItemModel();
      }
    }
  },
  watch: {
    items: function() {
      // Items changed, scroll to top!
      this.$refs.container.scrollTop = 0;
    },
    selectedItem: function() {
      const self = this;
      if (this.selectedItem != null) {
        this.$nextTick(function() {
          let list = self.$refs.list;
          let element =
            list.$children[self.items.indexOf(self.selectedItem)].$el;
          if (element != null) {
            self.$el.scrollTop = Math.floor (element.offsetTop);
          }
        });
      }
    }
  },
  mounted() {},
  methods: {
    itemClicked(eventInfo) {
      this.$emit("itemClicked", eventInfo);
    },
    playItem(eventInfo) {
      this.$emit("playItem", eventInfo);
    },
    onPlayStarted(eventInfo) {
      this.$emit("playStarted", eventInfo);
    }

  }
};
</script>
